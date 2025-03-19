
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/types/property";
import { ImagePreview } from "@/components/ImagePreview";
import { Trash2, Upload } from "lucide-react";

interface ImageUploaderProps {
  images: PropertyImage[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  isUploading?: boolean;
}

export function ImageUploader({
  images,
  onUpload,
  onRemove,
  isUploading = false
}: ImageUploaderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <div 
                key={image.id || `image-${index}`} 
                className="relative rounded-md overflow-hidden aspect-square"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <ImagePreview
                  src={image.url}
                  alt={image.alt || `Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {hoveredIndex === index && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-muted-foreground p-8 bg-muted rounded-md">
              No images uploaded
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('property-image-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          <input
            type="file"
            id="property-image-upload"
            className="hidden"
            onChange={onUpload}
            accept="image/*"
            multiple
          />
        </div>
      </CardContent>
    </Card>
  );
}
