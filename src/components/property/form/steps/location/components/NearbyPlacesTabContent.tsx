
import { AlertCircle } from "lucide-react";
import { CategorySection } from "./CategorySection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyNearbyPlace } from "@/types/property";

interface NearbyPlacesTabContentProps {
  tabId: string;
  category: string;
  places: PropertyNearbyPlace[];
  onRemovePlace?: (index: number) => void;
  toggleVisibility: (index: number, visible: boolean) => void;
  toggleSelection: (index: number, selected: boolean) => void;
  selectedIndices: number[];
  selectionMode: boolean;
}

export function NearbyPlacesTabContent({
  tabId,
  category,
  places,
  onRemovePlace,
  toggleVisibility,
  toggleSelection,
  selectedIndices,
  selectionMode
}: NearbyPlacesTabContentProps) {
  if (places && places.length > 0) {
    return (
      <CategorySection
        key={tabId}
        category={category}
        places={places}
        onRemovePlace={onRemovePlace}
        toggleVisibility={toggleVisibility}
        toggleSelection={toggleSelection}
        selectedIndices={selectedIndices}
        isVisible={(place) => !!place.visible_in_webview}
        selectionMode={selectionMode}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="default" className="bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            No {category.toLowerCase()} found near this property. Use the "Fetch" button above to search for places in this category.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
