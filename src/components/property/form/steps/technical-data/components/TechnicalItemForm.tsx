
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFloorplan, PropertyTechnicalItem } from "@/types/property";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Image, Trash2, Upload } from "lucide-react";
import { useState } from "react";

interface TechnicalItemFormProps {
  item: PropertyTechnicalItem;
  floorplans: PropertyFloorplan[];
  onUpdate: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onRemove: (e: React.MouseEvent) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>, technicalItemId: string) => void;
}

export function TechnicalItemForm({ 
  item, 
  floorplans, 
  onUpdate, 
  onRemove,
  onFloorplanUpload 
}: TechnicalItemFormProps) {
  const [uploadingFloorplan, setUploadingFloorplan] = useState(false);
  
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

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFloorplanUpload || !e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploadingFloorplan(true);
      await onFloorplanUpload(e, item.id);
    } finally {
      setUploadingFloorplan(false);
      // Reset the input value to allow uploading the same file again
      e.target.value = '';
    }
  };
  
  // Find the associated floorplan, if any
  const associatedFloorplan = item.floorplanId 
    ? floorplans.find(f => f.id === item.floorplanId) 
    : null;
  
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`technical-floorplan-upload-${item.id}`}>Floorplan Image</Label>
            <div>
              <Input
                id={`technical-floorplan-upload-${item.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFloorplanUpload}
              />
              <Label htmlFor={`technical-floorplan-upload-${item.id}`}>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="cursor-pointer" 
                  disabled={uploadingFloorplan}
                  asChild
                >
                  <span>
                    {uploadingFloorplan ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Floorplan
                      </>
                    )}
                  </span>
                </Button>
              </Label>
            </div>
          </div>
          
          {/* Show floorplan preview if one is selected */}
          {associatedFloorplan && (
            <div className="mt-2 border rounded-md overflow-hidden p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Floorplan</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleFloorplanChange('none')}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <img 
                src={associatedFloorplan.url} 
                alt={`Floorplan for ${item.title}`} 
                className="w-full h-auto max-h-[200px] object-contain" 
              />
            </div>
          )}
          
          {/* Show dropdown to select from existing floorplans */}
          {floorplans.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor={`technical-floorplan-${item.id}`}>
                {associatedFloorplan ? 'Change Floorplan' : 'Select Existing Floorplan'}
              </Label>
              <Select
                value={item.floorplanId || 'none'}
                onValueChange={handleFloorplanChange}
              >
                <SelectTrigger id={`technical-floorplan-${item.id}`}>
                  <SelectValue placeholder="Select a floorplan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {floorplans.map((floorplan, index) => (
                    <SelectItem key={floorplan.id} value={floorplan.id || ''}>
                      Floorplan {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
