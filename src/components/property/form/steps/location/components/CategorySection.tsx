
import { PropertyNearbyPlace } from "@/types/property";
import { PlaceItem } from "./PlaceItem";

interface CategorySectionProps {
  category: { name: string; count: number };
  places: PropertyNearbyPlace[];
  allPlaces: PropertyNearbyPlace[];
  toggleVisibility: (placeIndex: number, visible: boolean) => void;
  isVisible: boolean;
}

export function CategorySection({
  category,
  places,
  allPlaces,
  toggleVisibility,
  isVisible
}: CategorySectionProps) {
  if (!isVisible || places.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium capitalize">{category.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {places.map((place, index) => {
          const originalIndex = allPlaces.findIndex(p => p.id === place.id);
          return (
            <PlaceItem
              key={place.id || index}
              place={place}
              index={index}
              originalIndex={originalIndex}
              onVisibilityChange={toggleVisibility}
              category={category.name}
            />
          );
        })}
      </div>
    </div>
  );
}
