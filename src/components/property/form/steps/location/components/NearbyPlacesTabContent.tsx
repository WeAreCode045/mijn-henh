
import { PropertyNearbyPlace } from "@/types/property";
import { CategorySection } from "./CategorySection";
import { CategoryFilters } from "./CategoryFilters";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface NearbyPlacesTabContentProps {
  tabId: string;
  category: string;
  places: PropertyNearbyPlace[];
  onRemovePlace?: (index: number) => void;
  toggleVisibility: (index: number, visible: boolean) => void;
  toggleSelection: (index: number, selected: boolean) => void;
  selectedIndices: number[];
  selectionMode?: boolean;
  getCategoryColor?: (type: string) => string;
  getCategoryIcon?: (type: string) => React.ReactNode;
  isReadOnly?: boolean;
}

export function NearbyPlacesTabContent({
  tabId,
  category,
  places,
  onRemovePlace,
  toggleVisibility,
  toggleSelection,
  selectedIndices,
  selectionMode = false,
  getCategoryColor,
  getCategoryIcon,
  isReadOnly = false
}: NearbyPlacesTabContentProps) {
  const [filterType, setFilterType] = useState<"all" | "visible" | "hidden">("all");
  
  const filteredPlaces = places.filter(place => {
    if (filterType === "all") return true;
    if (filterType === "visible") return place.visible_in_webview === true;
    if (filterType === "hidden") return place.visible_in_webview === false;
    return true;
  });
  
  const isVisible = (place: PropertyNearbyPlace): boolean => {
    return place.visible_in_webview === true;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <CategoryFilters 
          filterType={filterType} 
          setFilterType={setFilterType} 
          isReadOnly={isReadOnly}
        />
        
        {selectionMode && selectedIndices.length > 0 && !isReadOnly && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center"
            onClick={() => {}}
            disabled={isReadOnly}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
          </Button>
        )}
      </div>
      
      {filteredPlaces.length > 0 ? (
        <CategorySection
          key={category}
          category={category}
          places={filteredPlaces}
          onRemovePlace={onRemovePlace}
          toggleVisibility={toggleVisibility}
          toggleSelection={toggleSelection}
          selectedIndices={selectedIndices}
          isVisible={isVisible}
          selectionMode={selectionMode}
          getCategoryColor={getCategoryColor}
          getCategoryIcon={getCategoryIcon}
          isReadOnly={isReadOnly}
        />
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md text-gray-500">
          No {filterType !== "all" ? filterType : ""} places found in this category
        </div>
      )}
    </div>
  );
}
