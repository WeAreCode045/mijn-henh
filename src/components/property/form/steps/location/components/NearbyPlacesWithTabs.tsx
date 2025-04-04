
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NearbyPlacesTabContent } from "./NearbyPlacesTabContent";
import { CategoryType } from "../hooks/useCategories";
import { Button } from "@/components/ui/button";
import { PropertyNearbyPlace } from "@/types/property";

interface NearbyPlacesWithTabsProps {
  nearbyPlaces: PropertyNearbyPlace[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: CategoryType[];
  placesByCategory: Record<string, PropertyNearbyPlace[]>;
  onRemovePlace?: (index: number) => void;
  togglePlaceVisibility: (index: number, visible: boolean) => void;
  togglePlaceSelection: (index: number, selected: boolean) => void;
  selectedPlacesToDelete: number[];
  handleBulkDelete: () => void;
  handleFetchCategory: (categoryId: string) => Promise<void>;
  isFetchingCategory: boolean;
  currentCategory: string;
}

export function NearbyPlacesWithTabs({
  nearbyPlaces,
  activeTab,
  setActiveTab,
  categories,
  placesByCategory,
  onRemovePlace,
  togglePlaceVisibility,
  togglePlaceSelection,
  selectedPlacesToDelete,
  handleBulkDelete,
  handleFetchCategory,
  isFetchingCategory,
  currentCategory
}: NearbyPlacesWithTabsProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all">All ({nearbyPlaces.length})</TabsTrigger>
          {categories.map(category => {
            const Icon = category.icon;
            const count = placesByCategory[category.id]?.length || 0;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                {category.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <div className="mt-4">
          {selectedPlacesToDelete.length > 0 && (
            <div className="mb-4">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBulkDelete}
                className="ml-auto"
              >
                Delete Selected ({selectedPlacesToDelete.length})
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="all" className="space-y-4">
          {nearbyPlaces.length > 0 ? (
            <NearbyPlacesTabContent
              tabId="all-places"
              category="All Places"
              places={nearbyPlaces}
              onRemovePlace={onRemovePlace}
              toggleVisibility={togglePlaceVisibility}
              toggleSelection={togglePlaceSelection}
              selectedIndices={selectedPlacesToDelete}
              selectionMode={selectedPlacesToDelete.length > 0}
            />
          ) : (
            <p className="text-center py-4 text-muted-foreground">No places found</p>
          )}
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <NearbyPlacesTabContent
              tabId={category.id}
              category={category.label}
              places={placesByCategory[category.id] || []}
              onRemovePlace={onRemovePlace}
              toggleVisibility={togglePlaceVisibility}
              toggleSelection={togglePlaceSelection}
              selectedIndices={selectedPlacesToDelete}
              selectionMode={selectedPlacesToDelete.length > 0}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
