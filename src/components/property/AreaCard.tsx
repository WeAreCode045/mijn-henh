
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { AreaImageGrid } from "./AreaImageGrid";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ImageSelectDialog } from "./ImageSelectDialog";
import { PropertyArea, PropertyImage } from "@/types/property";

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
  images = [],
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
}: AreaCardProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  
  // Filter property images based on area's imageIds
  const areaImages = area.imageIds
    ? images.filter(img => area.imageIds.includes(img.id))
    : [];
  
  console.log(`AreaCard ${area.id} (${area.title}) - filtered images:`, areaImages);
  console.log(`AreaCard ${area.id} - imageIds:`, area.imageIds);
  console.log(`AreaCard ${area.id} - available images:`, images);

  const handleImageSelection = (selectedImageIds: string[]) => {
    if (onImagesSelect) {
      onImagesSelect(area.id, selectedImageIds);
    }
    setImageDialogOpen(false);
  };

  const handleColumnsChange = (value: string) => {
    const numColumns = parseInt(value, 10);
    if (!isNaN(numColumns) && numColumns > 0) {
      onUpdate(area.id, "columns", numColumns);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 space-y-4">
          <Input
            placeholder="Area title"
            value={area.title}
            onChange={(e) => onUpdate(area.id, "title", e.target.value)}
            className="font-semibold text-lg"
          />
          <Textarea
            placeholder="Describe this area of the property..."
            value={area.description}
            onChange={(e) => onUpdate(area.id, "description", e.target.value)}
            rows={4}
          />
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Display columns:</label>
            <select 
              value={area.columns || 2} 
              onChange={(e) => handleColumnsChange(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="1">1 column</option>
              <option value="2">2 columns</option>
              <option value="3">3 columns</option>
              <option value="4">4 columns</option>
            </select>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(area.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <AreaImageGrid
        areaImages={areaImages}
        areaId={area.id}
        areaTitle={area.title}
        onImageRemove={onImageRemove}
      />

      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.accept = "image/*";
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                onImageUpload(area.id, files);
              }
            };
            input.click();
          }}
        >
          Upload Images
        </Button>

        {onImagesSelect && (
          <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary" size="sm">
                Select from Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <ImageSelectDialog
                allImages={images}
                selectedImageIds={area.imageIds || []}
                onSelect={handleImageSelection}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
