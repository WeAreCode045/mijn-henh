
import { PropertyNearbyPlace } from "@/types/property";
import { PlaceItem } from "./PlaceItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CategorySectionProps {
  category: string;
  places: PropertyNearbyPlace[];
  onRemovePlace?: (index: number) => void;
  toggleVisibility: (index: number, visible: boolean) => void;
  toggleSelection?: (index: number, selected: boolean) => void;
  selectedIndices?: number[];
  isVisible: (place: PropertyNearbyPlace) => boolean;
  selectionMode?: boolean;
}

export function CategorySection({
  category,
  places,
  onRemovePlace,
  toggleVisibility,
  toggleSelection,
  selectedIndices = [],
  isVisible,
  selectionMode = false
}: CategorySectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{category}</CardTitle>
          
          {/* Removed the selection mode switch as we control this from the parent now */}
        </div>
        <CardDescription>
          {places.length} {places.length === 1 ? 'place' : 'places'} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {places.map((place, index) => (
            <PlaceItem
              key={place.id || index}
              place={place}
              index={index}
              originalIndex={index}
              onRemove={onRemovePlace}
              onVisibilityChange={toggleVisibility}
              onSelectionChange={toggleSelection}
              isSelected={selectedIndices.includes(index)}
              category={place.type || ''}
              visible={isVisible(place)}
              selectionMode={selectionMode}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
