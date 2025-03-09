
import { PropertyNearbyPlace } from "@/types/property";
import { PlaceItem } from "./PlaceItem";

interface CategorySectionProps {
  category: string;
  places: PropertyNearbyPlace[];
  allPlaces: PropertyNearbyPlace[];
  onRemoveNearbyPlace?: (index: number) => void;
  togglePlaceVisibility: (placeIndex: number, visible: boolean) => void;
}

export function CategorySection({
  category,
  places,
  allPlaces,
  onRemoveNearbyPlace,
  togglePlaceVisibility
}: CategorySectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium capitalize">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {places.map((place, index) => {
          const originalIndex = allPlaces.findIndex(p => p.id === place.id);
          return (
            <PlaceItem
              key={place.id || index}
              place={place}
              index={index}
              originalIndex={originalIndex}
              onRemove={onRemoveNearbyPlace}
              onVisibilityChange={togglePlaceVisibility}
              category={category}
            />
          );
        })}
      </div>
    </div>
  );
}
