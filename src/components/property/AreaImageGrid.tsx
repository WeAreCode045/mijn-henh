
import { PropertyImage } from "@/types/property";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface AreaImageGridProps {
  areaImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
}

export function AreaImageGrid({ areaImages = [], areaId, areaTitle, onImageRemove }: AreaImageGridProps) {
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    console.log(`AreaImageGrid for ${areaId} (${areaTitle}) - received ${areaImages.length} images:`, areaImages);
  }, [areaImages, areaId, areaTitle]);
  
  // Filter out images with load errors
  const validAreaImages = areaImages.filter(image => !imageLoadErrors[image.id]);
  
  const handleImageError = (imageId: string) => {
    console.log(`Image loading error for ${imageId} in area ${areaId}`);
    setImageLoadErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
    
    // Optionally, we could also remove the image from the area here
    // onImageRemove(areaId, imageId);
  };

  if (!validAreaImages || validAreaImages.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500 text-sm">
        No images added to this area yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {validAreaImages.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.url}
            alt={areaTitle}
            className="w-full h-24 object-cover rounded-md"
            onError={() => handleImageError(image.id)}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onImageRemove(areaId, image.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
