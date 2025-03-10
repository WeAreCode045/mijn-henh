
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
  
  // Reset image load errors when areaImages changes
  useEffect(() => {
    setImageLoadErrors({});
  }, [areaImages]);
  
  // Filter out images with load errors and sort by sort_order
  const validAreaImages = areaImages
    .filter(image => !imageLoadErrors[image.id])
    .sort((a, b) => {
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order;
      }
      return 0;
    });
  
  const handleImageError = (imageId: string) => {
    console.log(`Image loading error for ${imageId} in area ${areaId}`);
    setImageLoadErrors(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  if (!validAreaImages || validAreaImages.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500 text-sm">
        No images added to this area yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {validAreaImages.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.url}
            alt={`${areaTitle} - ${image.id}`}
            className="w-full h-32 object-cover rounded-md"
            onError={() => handleImageError(image.id)}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 opacity-100 shadow-sm"
            onClick={() => onImageRemove(areaId, image.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
