
import { Check } from "lucide-react";
import { PropertyImage } from "@/types/property";

interface ImageGridProps {
  images: PropertyImage[];
  selected: string[];
  onToggleSelect: (imageId: string) => void;
  singleSelect?: boolean;
}

export function ImageGrid({ images, selected, onToggleSelect, singleSelect = false }: ImageGridProps) {
  const handleImageClick = (imageId: string, e: React.MouseEvent) => {
    // Prevent default actions and propagation
    e.preventDefault();
    e.stopPropagation();
    
    onToggleSelect(imageId);
  };
  
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
          onClick={(e) => handleImageClick(image.id, e)}
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
          
          {/* Add radio button visual for single select mode */}
          {singleSelect && (
            <div className="absolute bottom-1 right-1">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selected.includes(image.id) 
                  ? "border-primary bg-primary" 
                  : "border-gray-400"
              }`}>
                {selected.includes(image.id) && (
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {images.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No images available. Please upload images first.</p>
        </div>
      )}
    </div>
  );
}
