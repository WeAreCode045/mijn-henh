
import { PropertyImage } from "@/types/property";
import { X } from "lucide-react";

interface AreaImageGridProps {
  areaImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
}

export function AreaImageGrid({ areaImages = [], areaId, areaTitle, onImageRemove }: AreaImageGridProps) {
  console.log(`AreaImageGrid for ${areaId} (${areaTitle}) - images:`, areaImages);
  
  if (!areaImages || areaImages.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500 text-sm">
        No images added to this area yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {areaImages.map((image) => (
        <div key={image.id} className="relative group">
          <img
            src={image.url}
            alt={areaTitle}
            className="w-full h-24 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => onImageRemove(areaId, image.id)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
