
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicalItemFormProps {
  item: PropertyTechnicalItem;
  floorplans: PropertyFloorplan[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
}

export function TechnicalItemForm({ 
  item, 
  floorplans, 
  onRemove, 
  onUpdate 
}: TechnicalItemFormProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`title-${item.id}`}>Title</Label>
          <Input
            type="text"
            id={`title-${item.id}`}
            value={item.title || ''}
            onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`size-${item.id}`}>Size</Label>
          <Input
            type="text"
            id={`size-${item.id}`}
            value={item.size || ''}
            onChange={(e) => onUpdate(item.id, 'size', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-2">
        <Label htmlFor={`description-${item.id}`}>Description</Label>
        <Textarea
          id={`description-${item.id}`}
          value={item.description || ''}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
        />
      </div>
      
      {floorplans && floorplans.length > 0 && (
        <div className="mt-2">
          <Label htmlFor={`floorplan-${item.id}`}>Floorplan</Label>
          <Select 
            onValueChange={(value) => onUpdate(item.id, 'floorplanId', value)}
            defaultValue={item.floorplanId || "none"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a floorplan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Floorplan</SelectItem>
              {floorplans.map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {`Floorplan ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        variant="destructive"
        size="sm"
        className="mt-4"
        onClick={() => onRemove(item.id)}
      >
        <Trash className="h-4 w-4 mr-2" />
        Remove
      </Button>
    </div>
  );
}
