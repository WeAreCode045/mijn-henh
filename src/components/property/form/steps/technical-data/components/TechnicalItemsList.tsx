
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TechnicalItemForm } from "./TechnicalItemForm";
import { PropertyFloorplan, PropertyTechnicalItem } from "@/types/property";

interface TechnicalItemsListProps {
  items: PropertyTechnicalItem[];
  floorplans: PropertyFloorplan[];
  onAdd: (e: React.MouseEvent) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
}

export function TechnicalItemsList({ 
  items = [], 
  floorplans = [],
  onAdd, 
  onRemove, 
  onUpdate 
}: TechnicalItemsListProps) {
  // Helper to prevent default form submission behavior
  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onRemove(id);
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Technical Information</CardTitle>
        <Button 
          onClick={onAdd} 
          size="sm" 
          className="h-8"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No technical items yet. Click the button above to add one.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <TechnicalItemForm
                key={item.id}
                item={item}
                floorplans={floorplans}
                onUpdate={onUpdate}
                onRemove={(e) => handleRemoveItem(e, item.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
