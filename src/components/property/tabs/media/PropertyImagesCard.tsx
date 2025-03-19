
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyImage } from "@/types/property";
import { SortableImageGrid } from "./images/SortableImageGrid";
import { AdvancedImageUploader } from "@/components/ui/AdvancedImageUploader";

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
        <CardTitle>Property Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AdvancedImageUploader 
          onUpload={onImageUpload} 
          isUploading={isUploading} 
          label="Upload Images"
          multiple={true}
        />
        
        {(!images || images.length === 0) ? (
          <div className="text-center py-6 mt-4">
            <p className="text-muted-foreground">No images uploaded yet</p>
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
