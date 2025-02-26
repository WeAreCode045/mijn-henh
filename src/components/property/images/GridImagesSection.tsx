
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { ImageSelectDialog } from "../ImageSelectDialog";

interface GridImagesSectionProps {
  gridImages: string[];
  images: PropertyImage[];
  onToggleGridImage: (urls: string[]) => void;
}

export function GridImagesSection({
  gridImages,
  images,
  onToggleGridImage,
}: GridImagesSectionProps) {
  const handleGridImagesSelect = (selectedUrls: string[]) => {
    // Get current grid images
    const currentGridImages = [...gridImages];
    
    // Add new selected images while respecting the 4 image limit
    selectedUrls.forEach(url => {
      if (currentGridImages.length < 4 && !currentGridImages.includes(url)) {
        currentGridImages.push(url);
      }
    });

    // Update grid images
    onToggleGridImage(currentGridImages);
  };

  return (
    <div className="space-y-4">
      <Label>Grid Images (4 images)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {gridImages.map((url, index) => (
          <div key={`${url}-${index}`} className="relative group">
            <img
              src={url}
              alt={`Grid photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6"
                onClick={() => {
                  const newGridImages = gridImages.filter((_, i) => i !== index);
                  onToggleGridImage(newGridImages);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        {gridImages.length < 4 && (
          <ImageSelectDialog
            images={images.filter(img => !gridImages.includes(img.url))}
            onSelect={(selectedIds) => {
              const selectedUrls = selectedIds
                .map(id => images.find(img => img.id === id)?.url)
                .filter((url): url is string => url !== undefined);
              handleGridImagesSelect(selectedUrls);
            }}
            buttonText="Add Grid Images"
            maxSelect={4 - gridImages.length}
          />
        )}
      </div>
    </div>
  );
}
