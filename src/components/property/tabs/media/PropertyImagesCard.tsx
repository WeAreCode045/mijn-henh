
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon, Trash2Icon, StarIcon, GridIcon } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { useState } from "react";
import { ImagePreview } from "@/components/ui/ImagePreview";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeatured?: (url: string) => void; 
  onToggleCover?: (url: string) => void;
  featuredImageUrl?: string | null;
  coverImageUrls?: string[];
  isUploading?: boolean;
}

export function PropertyImagesCard({
  images = [],
  onImageUpload,
  onRemoveImage,
  onSetFeatured,
  onToggleCover,
  featuredImageUrl,
  coverImageUrls = [],
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

  // Add methods to handle main and cover image actions with preventDefault
  const handleSetFeatured = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent form submission
    if (onSetFeatured) {
      onSetFeatured(url);
    }
  };

  const handleToggleCover = (e: React.MouseEvent, url: string) => {
    e.preventDefault(); // Prevent form submission
    if (onToggleCover) {
      onToggleCover(url);
    }
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
                <ImagePreview
                  key={image.id || index}
                  url={image.url}
                  onRemove={() => onRemoveImage(index)}
                  isFeatured={image.url === featuredImageUrl}
                  onSetFeatured={(e) => handleSetFeatured(e, image.url)}
                  isInCover={coverImageUrls.includes(image.url)}
                  onToggleCover={(e) => handleToggleCover(e, image.url)}
                />
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
