
import { PropertyCity } from "@/types/property";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface CityItemProps {
  city: PropertyCity;
  index: number;
  onVisibilityChange: (index: number, visible: boolean) => void;
  isVisible: boolean;
  isReadOnly?: boolean;
}

export function CityItem({ 
  city, 
  index,
  onVisibilityChange,
  isVisible,
  isReadOnly = false
}: CityItemProps) {
  return (
    <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <Checkbox 
          id={`city-${index}`}
          checked={isVisible}
          onCheckedChange={(checked) => {
            if (!isReadOnly) {
              onVisibilityChange(index, checked === true);
            }
          }}
          disabled={isReadOnly}
        />
        <div>
          <div className="font-medium">{city.name}</div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {city.distance !== undefined && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {typeof city.distance === 'number' 
                  ? `${city.distance.toFixed(1)} km` 
                  : city.distance}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
