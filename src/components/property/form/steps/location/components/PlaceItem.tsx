
import { PropertyPlaceType } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface PlaceItemProps {
  place: PropertyPlaceType;
  onRemove?: (index: number) => void;
  onVisibilityChange: (index: number, visible: boolean) => void;
  onSelectionChange?: (index: number, selected: boolean) => void;
  index: number;
  originalIndex: number;
  category: string;
  visible: boolean;
  isSelected?: boolean;
  selectionMode?: boolean;
  getCategoryColor?: (type: string) => string;
  getCategoryIcon?: (type: string) => React.ReactNode;
  isReadOnly?: boolean;
}

export function PlaceItem({ 
  place, 
  index, 
  originalIndex, 
  onRemove, 
  onVisibilityChange,
  onSelectionChange,
  category,
  visible,
  isSelected = false,
  selectionMode = false,
  getCategoryColor,
  getCategoryIcon,
  isReadOnly = false
}: PlaceItemProps) {
  const categoryColor = getCategoryColor ? getCategoryColor(place.type || '') : "";
  
  return (
    <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        {selectionMode ? (
          <Checkbox 
            id={`place-select-${originalIndex}`}
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (onSelectionChange && !isReadOnly) {
                onSelectionChange(originalIndex, checked === true);
              }
            }}
            disabled={isReadOnly}
          />
        ) : (
          <Checkbox 
            id={`place-${originalIndex}`}
            checked={visible}
            onCheckedChange={(checked) => {
              if (!isReadOnly) {
                onVisibilityChange(originalIndex, checked === true);
              }
            }}
            disabled={isReadOnly}
          />
        )}
        <div>
          <div className="font-medium flex items-center gap-1">
            {getCategoryIcon && getCategoryIcon(place.type || '')}
            {place.name}
          </div>
          <div className="text-sm text-gray-500">{place.vicinity}</div>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {place.type && (
              <Badge 
                variant="outline" 
                className={`text-xs ${categoryColor}`}
              >
                {place.type}
              </Badge>
            )}
            
            {place.distance && (
              <Badge variant="secondary" className="text-xs">
                {typeof place.distance === 'number' 
                  ? `${place.distance} km` 
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
      {onRemove && !selectionMode && !isReadOnly && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full text-gray-500 hover:text-red-500"
          onClick={() => onRemove(originalIndex)}
          disabled={isReadOnly}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
