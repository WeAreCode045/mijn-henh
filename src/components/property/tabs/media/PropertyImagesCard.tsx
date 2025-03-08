
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyImage } from "@/types/property";
import { useState, useEffect } from "react";
import { ImageUploader } from "./images/ImageUploader";
import { SortableImageGrid } from "./images/SortableImageGrid";
import { useSortableImages } from "@/hooks/images/useSortableImages";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeatured?: (url: string) => void; 
  onToggleFeatured?: (url: string) => void;
  featuredImageUrl?: string | null;
  featuredImageUrls?: string[];
  isUploading?: boolean;
  propertyId?: string;
}

export function PropertyImagesCard({
  images = [],
  onImageUpload,
  onRemoveImage,
  onSetFeatured,
  onToggleFeatured,
  featuredImageUrl,
  featuredImageUrls = [],
  isUploading = false,
  propertyId,
}: PropertyImagesCardProps) {
  const [uploading, setUploading] = useState(isUploading);
  
  const { sortableImages, handleDragEnd } = useSortableImages(images, propertyId);

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  const handleSetFeatured = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent form submission
    if (onSetFeatured) {
      onSetFeatured(url);
    }
  };

  const handleToggleFeatured = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent form submission
    if (onToggleFeatured) {
      onToggleFeatured(url);
    }
  };

  // Debug logging for rendering
  console.log("Rendering PropertyImagesCard with:", {
    imageCount: sortableImages.length,
    sortOrders: sortableImages.map(i => i.sort_order || 'none'),
    featuredImageUrl,
    featuredImageUrls
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <ImageUploader 
            onImageUpload={onImageUpload}
            isUploading={uploading}
          />
          
          <SortableImageGrid 
            images={sortableImages}
            onRemoveImage={onRemoveImage}
            handleSetFeatured={handleSetFeatured}
            handleToggleFeatured={handleToggleFeatured}
            featuredImageUrl={featuredImageUrl}
            featuredImageUrls={featuredImageUrls}
            onDragEnd={handleDragEnd}
          />
        </div>
      </CardContent>
    </Card>
  );
}
