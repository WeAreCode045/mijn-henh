
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { useState, useEffect } from "react";
import { ImagePreview } from "@/components/ui/ImagePreview";

interface PropertyImagesCardProps {
  images: PropertyImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeatured?: (url: string) => void; 
  onToggleFeatured?: (url: string) => void;
  featuredImageUrl?: string | null;
  featuredImageUrls?: string[];
  isUploading?: boolean;
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
}: PropertyImagesCardProps) {
  const [uploading, setUploading] = useState(isUploading);
  const fileInputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    onImageUpload(e);
    // Reset the file input value
    e.target.value = '';
  };

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Add methods to handle main and featured image actions with preventDefault
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={handleUploadClick}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <ImagePreview
                  key={image.id || index}
                  url={image.url}
                  onRemove={() => onRemoveImage(index)}
                  isFeatured={image.url === featuredImageUrl}
                  onSetFeatured={(e) => handleSetFeatured(e, image.url)}
                  isInFeatured={featuredImageUrls.includes(image.url)}
                  onToggleFeatured={(e) => handleToggleFeatured(e, image.url)}
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
