
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFloorplan, PropertyTechnicalItem } from "@/types/property";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface TechnicalItemFormProps {
  item: PropertyTechnicalItem;
  floorplans: PropertyFloorplan[];
  onUpdate: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onRemove: (e: React.MouseEvent) => void;
}

export function TechnicalItemForm({ item, floorplans, onUpdate, onRemove }: TechnicalItemFormProps) {
  // Create handlers that prevent form submission
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onUpdate(item.id, 'title', e.target.value);
  };
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onUpdate(item.id, 'size', e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    onUpdate(item.id, 'description', e.target.value);
  };
  
  const handleFloorplanChange = (value: string) => {
    onUpdate(item.id, 'floorplanId', value === 'none' ? null : value);
  };
  
  return (
    <Card className="border border-muted">
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`technical-title-${item.id}`}>Title</Label>
            <Input
              id={`technical-title-${item.id}`}
              value={item.title}
              onChange={handleTitleChange}
              placeholder="e.g., Kitchen, Bedroom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`technical-size-${item.id}`}>Size</Label>
            <Input
              id={`technical-size-${item.id}`}
              value={item.size}
              onChange={handleSizeChange}
              placeholder="e.g., 4.5 x 3.2m"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`technical-description-${item.id}`}>Description</Label>
          <Textarea
            id={`technical-description-${item.id}`}
            value={item.description}
            onChange={handleDescriptionChange}
            placeholder="Description of this area..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`technical-floorplan-${item.id}`}>Link to Floorplan (Optional)</Label>
          <Select
            value={item.floorplanId || 'none'}
            onValueChange={handleFloorplanChange}
          >
            <SelectTrigger id={`technical-floorplan-${item.id}`}>
              <SelectValue placeholder="Select a floorplan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {floorplans.map((floorplan) => (
                <SelectItem key={floorplan.id} value={floorplan.id || ''}>
                  Floorplan {floorplans.indexOf(floorplan) + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
