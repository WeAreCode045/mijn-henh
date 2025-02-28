
import { Label } from "@/components/ui/label";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface FeaturedImageSectionProps {
  formData: PropertyFormData;
  handleSetFeaturedImage: (url: string | null) => void;
}

export function FeaturedImageSection({ 
  formData, 
  handleSetFeaturedImage 
}: FeaturedImageSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleRemoveFeaturedImage = () => {
    console.log("Removing featured image");
    handleSetFeaturedImage(null);
  };

  const handleSelectImage = (imageIds: string[]) => {
    console.log("Selected image IDs:", imageIds);
    if (imageIds[0]) {
      const selectedImage = formData.images.find(img => img.id === imageIds[0]);
      handleSetFeaturedImage(selectedImage?.url || null);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Featured Image</Label>
      
      {formData.featuredImage ? (
        <div className="relative group h-64 rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={formData.featuredImage} 
            alt="Featured" 
            className="w-full h-full object-cover"
          />
          
          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={handleRemoveFeaturedImage}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div className="h-64 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex flex-col justify-center items-center p-4">
          <div className="text-gray-500 text-center mb-4">
            <p>No featured image selected</p>
            <p className="text-sm">Select an image to feature as the main property image</p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
          >
            Select Featured Image
          </Button>
        </div>
      )}
      
      <ImageSelectDialog
        images={formData.images || []}
        selectedImageIds={formData.featuredImage ? [formData.images.find(img => img.url === formData.featuredImage)?.id || ''] : []}
        onSelect={handleSelectImage}
        buttonText="Select Featured Image"
        maxSelect={1}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
