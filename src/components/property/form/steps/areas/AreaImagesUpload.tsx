
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyImage } from "@/types/property";

interface AreaImagesUploadProps {
  areaId: string;
  images: (PropertyImage | string)[];
  onRemove?: (imageId: string) => void;
  onUpload?: (files: FileList) => Promise<void>;
  isUploading?: boolean;
}

export function AreaImagesUpload({
  areaId,
  images,
  onRemove,
  onUpload,
  isUploading = false
}: AreaImagesUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onUpload) {
      onUpload(e.target.files);
      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  // Helper to get image URL from different formats
  const getImageUrl = (image: PropertyImage | string): string => {
    if (typeof image === 'string') return image;
    return image.url;
  };

  // Helper to get image ID from different formats
  const getImageId = (image: PropertyImage | string): string => {
    if (typeof image === 'string') return image;
    return image.id;
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex justify-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          multiple
        />
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Images
            </>
          )}
        </Button>
      </div>

      {/* Images Grid */}
      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={`${getImageId(image)}-${index}`} className="overflow-hidden group relative">
              <CardContent className="p-0">
                <img
                  src={getImageUrl(image)}
                  alt={`Area image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                {onRemove && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(getImageId(image))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed flex flex-col items-center justify-center">
          <Image className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Click "Upload Images" to add photos to this area</p>
        </div>
      )}
    </div>
  );
}
