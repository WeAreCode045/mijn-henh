
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CityItemProps {
  city: { 
    name: string; 
    distance: number;
    visible_in_webview?: boolean;
  };
  index: number;
  onVisibilityChange: (index: number, visible: boolean) => void;
}

export function CityItem({ city, index, onVisibilityChange }: CityItemProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <Checkbox 
          id={`city-${index}`}
          checked={city.visible_in_webview !== false}
          onCheckedChange={(checked) => {
            onVisibilityChange(index, checked === true);
          }}
        />
        <div>
          <div className="font-medium">{city.name}</div>
          <div className="text-sm text-gray-500">{city.distance} km</div>
        </div>
      </div>
    </div>
  );
}
