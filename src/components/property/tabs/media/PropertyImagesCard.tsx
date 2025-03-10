
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, UploadIcon } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { SortableImageGrid } from "./images/SortableImageGrid";

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
  // Handler to properly match the expected type
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Property Images</span>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <Button variant="outline" size="sm" disabled={isUploading}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </label>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(!images || images.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No images uploaded yet</p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Button variant="secondary" disabled={isUploading}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </label>
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
