
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import type { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

interface FeaturedImageSectionProps {
  formData: PropertyFormData;
  handleSetFeaturedImage: (url: string | null) => void;
}

export function FeaturedImageSection({ 
  formData, 
  handleSetFeaturedImage 
}: FeaturedImageSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (selectedIds: string[]) => {
    console.log("Selected image IDs in FeaturedImageSection:", selectedIds);
    
    if (!selectedIds || selectedIds.length === 0) {
      console.log("No images selected, skipping");
      return;
    }
    
    // Find the selected image in the images array
    const selectedImage = formData.images.find(img => img.id === selectedIds[0]);
    
    if (!selectedImage) {
      console.error("Selected image not found in formData.images");
      toast({
        title: "Error",
        description: "Selected image not found. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Setting featured image to:", selectedImage.url);
    
    // Ensure handleSetFeaturedImage is properly defined
    if (typeof handleSetFeaturedImage !== 'function') {
      console.error("handleSetFeaturedImage is not a function:", handleSetFeaturedImage);
      toast({
        title: "Error",
        description: "Failed to update featured image. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Call the function to set the featured image
    handleSetFeaturedImage(selectedImage.url);
    
    toast({
      title: "Success",
      description: "Featured image updated successfully",
    });
  };

  const handleRemoveImage = () => {
    if (typeof handleSetFeaturedImage !== 'function') {
      console.error("handleSetFeaturedImage is not a function:", handleSetFeaturedImage);
      toast({
        title: "Error",
        description: "Failed to remove featured image. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    handleSetFeaturedImage(null);
    toast({
      title: "Success",
      description: "Featured image removed",
    });
  };

  // Find the ID of the currently featured image
  const featuredImageId = formData.featuredImage ? 
    formData.images.find(img => img.url === formData.featuredImage)?.id : 
    undefined;

  return (
    <div>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Featured Image</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.featuredImage ? (
            <div className="relative group">
              <img 
                src={formData.featuredImage} 
                alt="Featured property image" 
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center h-48 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => setIsDialogOpen(true)}
            >
              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Select Featured Image</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ImageSelectDialog
        images={formData.images || []}
        selectedImageIds={featuredImageId ? [featuredImageId] : []}
        onSelect={handleImageSelect}
        buttonText="Select Featured Image"
        maxSelect={1}
        singleSelect={true}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
