
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { PropertyAreaImageUpload } from "./PropertyAreaImageUpload";
import { AreaImageGallery } from "./area/AreaImageGallery";
import { PropertyImage } from "@/types/property";
import { ChangeEvent } from "react";

interface PropertyAreaProps {
  id: string;
  title: string;
  description: string;
  images: PropertyImage[];
  allImages: PropertyImage[];
  onRemove: () => void;
  onUpdate: (field: string, value: any) => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onImageRemove: (imageId: string) => void;
  onImagesSelect: (imageIds: string[]) => void;
  isUploading?: boolean;
}

export function PropertyArea({
  id,
  title,
  description,
  images,
  allImages,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
  isUploading = false,
}: PropertyAreaProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1 mb-2">
            <Label htmlFor={`area-title-${id}`}>Title</Label>
            <Input
              id={`area-title-${id}`}
              value={title}
              onChange={(e) => onUpdate('title', e.target.value)}
              placeholder="Area name"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Remove Area"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-2">
        <div className="space-y-1">
          <Label htmlFor={`area-description-${id}`}>Description</Label>
          <Textarea
            id={`area-description-${id}`}
            value={description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Describe this area"
            rows={3}
          />
        </div>
        
        <div>
          <Label>Images</Label>
          <div className="mt-2 space-y-4">
            <AreaImageGallery
              areaImages={images}
              allImages={allImages}
              areaId={id}
              areaTitle={title}
              onImageRemove={(areaId, imageId) => onImageRemove(imageId)}
              onImagesSelect={(areaId, imageIds) => onImagesSelect(imageIds)}
            />
            
            <PropertyAreaImageUpload
              areaId={id}
              onUpload={onImageUpload}
              isUploading={isUploading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
