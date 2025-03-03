
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/types/property";
import { Check } from "lucide-react";

interface AreaImageSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: PropertyImage[];
  areaTitle: string;
  selectedImageIds: string[];
  onUpdate: (imageIds: string[]) => void;
}

export function AreaImageSelectDialog({
  open,
  onOpenChange,
  images,
  areaTitle,
  selectedImageIds,
  onUpdate,
}: AreaImageSelectDialogProps) {
  const toggleImageSelection = (imageId: string, e?: React.MouseEvent) => {
    // Prevent default actions if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const currentSelection = [...selectedImageIds];
    
    if (currentSelection.includes(imageId)) {
      // Remove from selection
      const newSelection = currentSelection.filter(id => id !== imageId);
      onUpdate(newSelection);
    } else {
      // Add to selection
      onUpdate([...currentSelection, imageId]);
    }
  };
  
  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent default actions
    e.preventDefault();
    e.stopPropagation();
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Images for {areaTitle || "Area"}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {images.map((image) => {
              const isSelected = selectedImageIds.includes(image.id);
              return (
                <div
                  key={image.id}
                  className={`
                    relative cursor-pointer border rounded-md overflow-hidden
                    ${isSelected ? "ring-2 ring-primary" : "hover:opacity-80"}
                  `}
                  onClick={(e) => toggleImageSelection(image.id, e)}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {images.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No images available. Upload images first.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={handleButtonClick} type="button">
            Cancel
          </Button>
          <Button onClick={handleButtonClick} type="button">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
