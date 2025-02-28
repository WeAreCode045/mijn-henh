
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Image as ImageIcon, Edit } from "lucide-react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { AreaImageGrid } from "./AreaImageGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AreaCardProps {
  area: PropertyArea;
  images: PropertyImage[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (id: string, imageIds: string[]) => void;
}

export function AreaCard({
  area,
  images,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
}: AreaCardProps) {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  
  // Get area images based on imageIds
  const areaImages = (area.imageIds || [])
    .map(id => images.find(img => img.id === id))
    .filter(Boolean) as PropertyImage[];
  
  console.log(`AreaCard ${area.id} - imageIds:`, area.imageIds);
  console.log(`AreaCard ${area.id} - found images:`, areaImages);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageUpload(area.id, event.target.files);
    }
  };

  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(area.id, "columns", parseInt(event.target.value));
  };

  const handleSelectImages = (selectedImageIds: string[]) => {
    console.log(`Selecting images for area ${area.id}:`, selectedImageIds);
    if (onImagesSelect) {
      onImagesSelect(area.id, selectedImageIds);
    }
    setIsSelectDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle>
            <Input
              value={area.title}
              onChange={(e) => onUpdate(area.id, "title", e.target.value)}
              placeholder="Area Title"
              className="text-xl font-bold"
            />
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(area.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`description-${area.id}`}>Description</Label>
          <Textarea
            id={`description-${area.id}`}
            value={area.description}
            onChange={(e) => onUpdate(area.id, "description", e.target.value)}
            placeholder="Describe this area..."
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor={`columns-${area.id}`}>Image Grid Columns</Label>
          <select
            id={`columns-${area.id}`}
            value={area.columns || 2}
            onChange={handleColumnChange}
            className="w-full rounded-md border border-input p-2 text-sm"
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectDialogOpen(true)}
                className="flex items-center"
              >
                <Edit className="mr-1 h-3 w-3" />
                Select Images
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    if (e && e.target) {
                      handleFileUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
                    }
                  };
                  input.click();
                }}
                className="flex items-center"
              >
                <ImageIcon className="mr-1 h-3 w-3" />
                Upload
              </Button>
            </div>
          </div>
          
          <AreaImageGrid
            areaImages={areaImages}
            areaId={area.id}
            areaTitle={area.title}
            onImageRemove={onImageRemove}
          />
        </div>
      </CardContent>
      
      {/* Dialog for selecting images */}
      <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Images for {area.title || "Area"}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {images.map((image) => {
                const isSelected = (area.imageIds || []).includes(image.id);
                return (
                  <div
                    key={image.id}
                    className={`
                      relative cursor-pointer border rounded-md overflow-hidden
                      ${isSelected ? "ring-2 ring-primary" : "hover:opacity-80"}
                    `}
                    onClick={() => {
                      const currentIds = [...(area.imageIds || [])];
                      const newIds = isSelected
                        ? currentIds.filter(id => id !== image.id)
                        : [...currentIds, image.id];
                      onUpdate(area.id, "imageIds", newIds);
                    }}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-24 object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {images.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <p>No images available. Upload images first.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsSelectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSelectDialogOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
