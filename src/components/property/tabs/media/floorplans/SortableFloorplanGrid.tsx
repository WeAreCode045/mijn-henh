
import React from "react";
import { PropertyImage } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableFloorplanGridProps {
  floorplans: PropertyImage[];
  propertyId: string;
  onRemoveFloorplan: (index: number) => void;
}

export function SortableFloorplanGrid({ 
  floorplans, 
  propertyId,
  onRemoveFloorplan
}: SortableFloorplanGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {floorplans.map((floorplan, index) => (
        <Card key={floorplan.id || index} className="overflow-hidden group relative">
          <div className="aspect-square relative">
            <img 
              src={floorplan.url} 
              alt={`Floorplan ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => onRemoveFloorplan(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
