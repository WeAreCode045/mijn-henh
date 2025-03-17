
import { PropertyImage } from "@/types/property";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface AreaImageGalleryProps {
  areaImages: PropertyImage[];
  allImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
}

export function AreaImageGallery({
  areaImages,
  allImages,
  areaId,
  areaTitle,
  onImageRemove,
  onImagesSelect,
}: AreaImageGalleryProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>(
    areaImages.map(img => img.id)
  );

  const handleImageSelect = (imageId: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleConfirmSelection = () => {
    onImagesSelect(areaId, selectedImages);
    setSelectOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setSelectOpen(open);
    if (open) {
      // Reset selected images to current area images when dialog opens
      setSelectedImages(areaImages.map(img => img.id));
    }
  };

  return (
    <div className="space-y-4">
      {areaImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {areaImages.map((image, index) => (
            <div key={image.id || index} className="relative group">
              <img
                src={image.url}
                alt={`Area ${areaTitle} image ${index + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onImageRemove(areaId, image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {areaImages.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
          No images assigned to this area yet
        </div>
      )}

      <Dialog open={selectOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button">
            Select from existing images
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Images for {areaTitle}</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
              {allImages.map((image) => (
                <div key={image.id} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedImages.includes(image.id)}
                      onCheckedChange={() => handleImageSelect(image.id)}
                    />
                  </div>
                  <img
                    src={image.url}
                    alt="Property"
                    className={`w-full h-32 object-cover rounded-md cursor-pointer 
                      ${selectedImages.includes(image.id) ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleImageSelect(image.id)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="default" 
              onClick={handleConfirmSelection}
            >
              Confirm Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
