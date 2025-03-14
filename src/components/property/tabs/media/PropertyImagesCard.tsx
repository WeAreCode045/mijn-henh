
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyImage } from "@/types/property";
import { SortableImageGrid } from "./images/SortableImageGrid";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
  onSetFeaturedImage?: (url: string | null) => void;
  onToggleFeaturedImage?: (url: string) => void;
  featuredImage?: string | null;
  featuredImages?: string[];
  propertyId?: string;
}

export function PropertyImagesCard({ 
  images, 
  onImageUpload, 
  onRemoveImage, 
  isUploading,
  onSetFeaturedImage,
  onToggleFeaturedImage,
  featuredImage,
  featuredImages = [],
  propertyId = ""
}: PropertyImagesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Property Images</span>
          <ImageUploader 
            onUpload={onImageUpload} 
            isUploading={isUploading} 
            label="Upload Images"
            multiple={true}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!images || images.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No images uploaded yet</p>
            <ImageUploader 
              onUpload={onImageUpload} 
              isUploading={isUploading} 
              label="Upload Images"
              multiple={true}
            />
          </div>
        ) : (
          <SortableImageGrid 
            images={images} 
            onRemoveImage={onRemoveImage}
            onSetFeaturedImage={onSetFeaturedImage}
            onToggleFeaturedImage={onToggleFeaturedImage}
            featuredImage={featuredImage}
            featuredImages={featuredImages}
            propertyId={propertyId}
          />
        )}
      </CardContent>
    </Card>
  );
}
