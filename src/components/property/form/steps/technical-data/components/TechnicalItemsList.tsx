
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import { TechnicalItemForm } from "./TechnicalItemForm";
import { Label } from "@/components/ui/label";

interface TechnicalItemsListProps {
  items: PropertyTechnicalItem[];
  floorplans: PropertyFloorplan[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
}

export function TechnicalItemsList({
  items,
  floorplans,
  onAdd,
  onRemove,
  onUpdate
}: TechnicalItemsListProps) {
  return (
    <div>
      <Label>Technical Items</Label>
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <TechnicalItemForm
              key={item.id}
              item={item}
              floorplans={floorplans}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No technical items added yet.</p>
      )}
      <Button variant="outline" className="mt-2" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Technical Item
      </Button>
    </div>
  );
}
