
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { ImageSelectDialog } from "../ImageSelectDialog";

interface FeaturedImageSectionProps {
  featuredImage: string | null;
  images: PropertyImage[];
  onSetFeaturedImage: (url: string | null) => void;
}

export function FeaturedImageSection({
  featuredImage,
  images,
  onSetFeaturedImage,
}: FeaturedImageSectionProps) {
  return (
    <div className="space-y-4">
      <Label>Featured Image</Label>
      <div className="relative group">
        {featuredImage ? (
          <div className="relative">
            <img
              src={featuredImage}
              alt="Featured property"
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-6 h-6"
              onClick={() => onSetFeaturedImage(null)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <ImageSelectDialog
            images={images}
            onSelect={(imageIds) => {
              const selectedImage = images.find(img => img.id === imageIds[0]);
              if (selectedImage) {
                onSetFeaturedImage(selectedImage.url);
              }
            }}
            buttonText="Select Featured Image"
            maxSelect={1}
          />
        )}
      </div>
    </div>
  );
}
