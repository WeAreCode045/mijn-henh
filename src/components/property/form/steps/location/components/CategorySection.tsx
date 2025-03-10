
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyNearbyPlace } from "@/types/property";
import { PlaceItem } from "./PlaceItem";

interface CategorySectionProps {
  category: string;
  places: PropertyNearbyPlace[];
  onRemovePlace?: (index: number) => void;
  toggleVisibility?: (placeIndex: number, visible: boolean) => void;
  isVisible?: (place: PropertyNearbyPlace) => boolean;
}

export function CategorySection({ 
  category, 
  places, 
  onRemovePlace,
  toggleVisibility,
  isVisible = () => true
}: CategorySectionProps) {
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-md">{formattedCategory} ({places.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {places.map((place, idx) => (
            <PlaceItem 
              key={place.id || idx} 
              place={place} 
              index={idx}
              originalIndex={place.id ? parseInt(place.id) : idx}
              category={category}
              onRemove={onRemovePlace ? () => onRemovePlace(idx) : undefined}
              onVisibilityChange={toggleVisibility ? 
                (index, visible) => toggleVisibility(index, visible) : 
                () => {}}
              visible={isVisible(place)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
