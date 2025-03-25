import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/types/property";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AreaImageSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: PropertyImage[];
  areaTitle: string;
  selectedImageIds: string[];
  onUpdate: (imageIds: string[]) => void;
  maxSelect?: number;
}

export function AreaImageSelectDialog({
  open,
  onOpenChange,
  images,
  areaTitle,
  selectedImageIds,
  onUpdate,
  maxSelect = 10,
}: AreaImageSelectDialogProps) {
  const [localSelection, setLocalSelection] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      console.log("AreaImageSelectDialog opened with selectedImageIds:", selectedImageIds);
      setLocalSelection([...selectedImageIds]);
    }
  }, [selectedImageIds, open]);

  const toggleImageSelection = (imageId: string) => {
    console.log(`Toggling selection for image ${imageId}`);
    setLocalSelection(current => {
      if (current.includes(imageId)) {
        return current.filter(id => id !== imageId);
      } else if (current.length >= maxSelect) {
        toast({
          title: "Maximum images reached",
          description: `You can select up to ${maxSelect} images for an area`,
          variant: "destructive"
        });
        return current;
      } else {
        return [...current, imageId];
      }
    });
  };
  
  const handleConfirm = () => {
    console.log(`AreaImageSelectDialog confirming selection:`, localSelection);
    onUpdate(localSelection);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    setLocalSelection([...selectedImageIds]);
    onOpenChange(false);
  };
  
  useEffect(() => {
    if (open) {
      console.log("Available images:", images);
      console.log("Selected image IDs:", selectedImageIds);
      console.log("Local selection:", localSelection);
    }
  }, [open, images, selectedImageIds, localSelection]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Images for {areaTitle || "Area"}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-2 text-sm text-muted-foreground">
            Select up to {maxSelect} images ({localSelection.length}/{maxSelect} selected)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {images.map((image) => {
              const isSelected = localSelection.includes(image.id);
              return (
                <div
                  key={image.id}
                  className={`
                    relative cursor-pointer border rounded-md overflow-hidden
                    ${isSelected ? "ring-2 ring-primary" : "hover:opacity-80"}
                  `}
                  onClick={() => toggleImageSelection(image.id)}
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
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                    ID: {image.id.slice(0, 8)}...
                  </div>
                </div>
              );
            })}
          </div>
          
          {images.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No images available. Upload images first in the Media tab.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button onClick={handleConfirm} type="button">
            Confirm Selection ({localSelection.length} images)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
