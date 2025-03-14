
import { PropertyPlaceType } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { getTransportationType } from "../utils/categoryUtils";

interface PlaceItemProps {
  place: PropertyPlaceType;
  onRemove?: (index: number) => void;
  onVisibilityChange: (index: number, visible: boolean) => void;
  index: number;
  originalIndex: number;
  category: string;
  visible: boolean;
}

export function PlaceItem({ 
  place, 
  index, 
  originalIndex, 
  onRemove, 
  onVisibilityChange,
  category,
  visible
}: PlaceItemProps) {
  return (
    <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <Checkbox 
          id={`place-${originalIndex}`}
          checked={visible}
          onCheckedChange={(checked) => {
            onVisibilityChange(originalIndex, checked === true);
          }}
        />
        <div>
          <div className="font-medium">{place.name}</div>
          <div className="text-sm text-gray-500">{place.vicinity}</div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {category === 'transportation' && (
              <Badge variant="outline" className="text-xs">
                {getTransportationType(place)}
              </Badge>
            )}
            
            {place.distance && (
              <Badge variant="secondary" className="text-xs">
                {typeof place.distance === 'number' 
                  ? `${place.distance.toFixed(1)} km` 
                  : place.distance}
              </Badge>
            )}
            
            {place.rating && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                ★ {place.rating}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {onRemove && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full text-gray-500 hover:text-red-500"
          onClick={() => onRemove(originalIndex)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
