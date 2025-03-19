
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/ImagePreview";
import { Upload, X } from "lucide-react";

interface PropertyImageUploadProps {
  images: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  isUploading?: boolean;
}

export function PropertyImageUpload({
  images,
  onUpload,
  onRemove,
  isUploading = false
}: PropertyImageUploadProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {images && images.length > 0 ? (
          images.map((image, index) => (
            <div 
              key={`image-${index}`} 
              className="relative rounded-md overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ImagePreview
                src={image}
                alt={`Property image ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              {hoveredIndex === index && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-sm text-muted-foreground p-4 bg-muted rounded-md">
            No images uploaded
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
        <input
          type="file"
          id="image-upload"
          className="hidden"
          onChange={onUpload}
          accept="image/*"
          multiple
        />
      </div>
    </div>
  );
}
