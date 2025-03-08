
import { PropertyPlaceType } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { getTransportationType } from "../utils/categoryUtils";

interface PlaceItemProps {
  place: PropertyPlaceType;
  index: number;
  originalIndex: number;
  onRemove?: (index: number) => void;
  onVisibilityChange: (index: number, visible: boolean) => void;
  category: string;
}

export function PlaceItem({ 
  place, 
  index, 
  originalIndex, 
  onRemove, 
  onVisibilityChange,
  category
}: PlaceItemProps) {
  return (
    <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <Checkbox 
          id={`place-${originalIndex}`}
          checked={place.visible_in_webview !== false}
          onCheckedChange={(checked) => {
            onVisibilityChange(originalIndex, checked === true);
          }}
        />
        <div>
          <div className="font-medium">{place.name}</div>
          <div className="text-sm text-gray-500">{place.vicinity}</div>
          {category === 'transportation' && (
            <Badge variant="outline" className="mt-1 text-xs">
              {getTransportationType(place)}
            </Badge>
          )}
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
