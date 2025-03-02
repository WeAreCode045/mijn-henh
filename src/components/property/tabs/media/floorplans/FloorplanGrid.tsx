
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PropertyFloorplan } from "@/types/property";

interface FloorplanGridProps {
  floorplans: PropertyFloorplan[];
  gridKey: number;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: any, value: any) => void;
}

export function FloorplanGrid({ 
  floorplans, 
  gridKey, 
  onRemoveFloorplan,
  onUpdateFloorplan
}: FloorplanGridProps) {
  const handleRemoveClick = (e: React.MouseEvent, index: number) => {
    // Explicitly prevent default behavior to avoid any URL navigation
    e.preventDefault();
    e.stopPropagation();
    
    if (onRemoveFloorplan) {
      onRemoveFloorplan(index);
    }
  };

  if (!floorplans.length) return null;

  return (
    <div key={gridKey} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {floorplans.map((floorplan, index) => (
        <div key={`${floorplan.id || `floorplan-${index}`}-${gridKey}`} className="relative group">
          <img
            src={floorplan.url}
            alt={`Floorplan ${index + 1}`}
            className="w-full h-auto max-h-[200px] object-contain border rounded-md bg-slate-50"
          />
          {onRemoveFloorplan && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleRemoveClick(e, index)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
