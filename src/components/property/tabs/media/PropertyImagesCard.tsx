
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon, Trash2Icon } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { useState } from "react";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  featuredImage?: string | null;
  gridImages?: string[];
  isUploading?: boolean;
}

export function PropertyImagesCard({
  images = [],
  onImageUpload,
  onRemoveImage,
  featuredImage,
  gridImages = [],
  isUploading = false,
}: PropertyImagesCardProps) {
  // File input ref
  const [uploading, setUploading] = useState(isUploading);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    onImageUpload(e);
    // Reset the file input value
    e.target.value = '';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <label htmlFor="image-upload" className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploading}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <div className="aspect-square border rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveImage(index)}
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                No images uploaded yet. Click "Upload Images" to add images.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
