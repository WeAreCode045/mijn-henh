
import { Check } from "lucide-react";
import { PropertyImage } from "@/types/property";

interface ImageGridProps {
  images: PropertyImage[];
  selected: string[];
  onToggleSelect: (imageId: string) => void;
}

export function ImageGrid({ images, selected, onToggleSelect }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
      {images.map((image) => (
        <div
          key={image.id}
          className={`relative cursor-pointer rounded-md border-2 ${
            selected.includes(image.id)
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={() => onToggleSelect(image.id)}
        >
          <div className="aspect-[4/3] relative">
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-contain absolute inset-0"
            />
          </div>
          {selected.includes(image.id) && (
            <div className="absolute top-1 right-1 bg-primary text-primary-foreground p-1 rounded-full">
              <Check className="w-3 h-3" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
