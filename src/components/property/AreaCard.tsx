
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageSelectDialog } from "./ImageSelectDialog";
import { AreaImageGrid } from "./AreaImageGrid";
import { useEffect } from "react";

interface AreaCardProps {
  area: PropertyArea;
  images: PropertyImage[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (areaId: string, imageIds: string[]) => void;
}

export function AreaCard({
  area,
  images = [],
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
}: AreaCardProps) {
  // Log the initial column value when the component mounts or area changes
  useEffect(() => {
    console.log(`AreaCard ${area.id} (${area.title}) - initial columns:`, area.columns);
    console.log(`AreaCard ${area.id} (${area.title}) - imageIds:`, area.imageIds);
  }, [area.id, area.title, area.columns, area.imageIds]);

  // Create a hidden file input for image upload
  const createFileInput = () => {
    const inputId = `area-images-${area.id}`;
    return (
      <>
        <input
          type="file"
          id={inputId}
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onImageUpload(area.id, e.target.files);
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            document.getElementById(inputId)?.click();
          }}
          className="flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </>
    );
  };

  // Handle column change
  const handleColumnChange = (value: string) => {
    const numValue = parseInt(value);
    console.log(`AreaCard - Changing columns for area ${area.id} from ${area.columns} to ${numValue}`);
    onUpdate(area.id, "columns", numValue);
  };

  // Filter images to only show those associated with this area
  const getImagesByIds = (imageIds: string[] = []): PropertyImage[] => {
    return images.filter(img => imageIds.includes(img.id));
  };

  const areaImages = getImagesByIds(area.imageIds || []);

  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
        onClick={() => onRemove(area.id)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader>
        <CardTitle>
          <Input
            value={area.title || ''}
            onChange={(e) => onUpdate(area.id, "title", e.target.value)}
            placeholder="Area Title"
            className="text-xl font-bold"
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          value={area.description || ''}
          onChange={(e) => onUpdate(area.id, "description", e.target.value)}
          placeholder="Enter description for this area"
          className="min-h-[100px]"
        />
        
        <div className="space-y-2">
          <Label htmlFor={`columns-${area.id}`}>Image Grid Columns</Label>
          <Select
            value={String(area.columns || 2)}
            onValueChange={handleColumnChange}
          >
            <SelectTrigger id={`columns-${area.id}`} className="w-full">
              <SelectValue placeholder="Select number of columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Column</SelectItem>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Images</Label>
            <div className="flex gap-2">
              {createFileInput()}
              
              <ImageSelectDialog
                images={images}
                selectedImageIds={area.imageIds || []}
                onSelect={(selectedIds) => {
                  console.log(`ImageSelectDialog - Selected IDs for area ${area.id}:`, selectedIds);
                  if (onImagesSelect) {
                    onImagesSelect(area.id, selectedIds);
                  } else {
                    onUpdate(area.id, "imageIds", selectedIds);
                  }
                }}
                buttonText="Select from Library"
                buttonIcon={<ImageIcon className="h-4 w-4 mr-2" />}
              />
            </div>
          </div>
          
          <AreaImageGrid 
            areaImages={areaImages} 
            areaId={area.id} 
            areaTitle={area.title || ''}
            onImageRemove={onImageRemove}
          />
        </div>
      </CardContent>
    </Card>
  );
}
