
import { PropertyCity } from "@/types/property";
import { Checkbox } from "@/components/ui/checkbox";

interface CityItemProps {
  city: PropertyCity;
  index: number;
  onVisibilityChange: (cityIndex: number, visible: boolean) => void;
  isVisible: boolean;
}

export function CityItem({ 
  city, 
  index, 
  onVisibilityChange,
  isVisible
}: CityItemProps) {
  return (
    <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <Checkbox 
          id={`city-${index}`}
          checked={isVisible}
          onCheckedChange={(checked) => {
            onVisibilityChange(index, checked === true);
          }}
        />
        <div>
          <div className="font-medium">{city.name}</div>
          {city.distance && (
            <div className="text-sm text-gray-500">
              {typeof city.distance === 'number' 
                ? `${city.distance.toFixed(1)} km` 
                : city.distance}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
