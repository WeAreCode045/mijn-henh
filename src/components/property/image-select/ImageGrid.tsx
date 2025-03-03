
import { Check } from "lucide-react";

interface ImageGridProps {
  images: string[]; // Changed from PropertyImage[] to string[]
  selected: string[];
  onSelect: (imageUrl: string) => void;
  selectionMode: "single" | "multiple";
  maxSelections?: number; 
}

export function ImageGrid({ 
  images, 
  selected, 
  onSelect, 
  selectionMode = "single",
  maxSelections = 4
}: ImageGridProps) {
  const handleImageClick = (imageUrl: string, e: React.MouseEvent) => {
    // Prevent default actions and propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Don't allow adding more than maxSelections if in multiple mode
    if (selectionMode === "multiple" && 
        !selected.includes(imageUrl) && 
        selected.length >= maxSelections) {
      return;
    }
    
    onSelect(imageUrl);
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
      {images.map((imageUrl, index) => (
        <div
          key={`image-${index}`}
          className={`relative cursor-pointer rounded-md border-2 ${
            selected.includes(imageUrl)
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={(e) => handleImageClick(imageUrl, e)}
        >
          <div className="aspect-[4/3] relative">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>
          {selected.includes(imageUrl) && (
            <div className="absolute top-1 right-1 bg-primary text-primary-foreground p-1 rounded-full">
              <Check className="w-3 h-3" />
            </div>
          )}
          
          {/* Add radio button visual for single select mode */}
          {selectionMode === "single" && (
            <div className="absolute bottom-1 right-1">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selected.includes(imageUrl) 
                  ? "border-primary bg-primary" 
                  : "border-gray-400"
              }`}>
                {selected.includes(imageUrl) && (
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
