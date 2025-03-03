
import { Label } from "@/components/ui/label";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageSelectionsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function ImageSelections({ 
  formData, 
  onFieldChange
}: ImageSelectionsProps) {
  // Get all available images
  const images = formData.images || [];

  // Handle featured image selection
  const handleSelectFeaturedImage = (image: PropertyImage) => {
    onFieldChange('featuredImage', image.url);
  };

  // Handle grid image selection/deselection
  const handleToggleGridImage = (image: PropertyImage) => {
    const currentGridImages = formData.gridImages || [];
    
    // Check if image is already in gridImages
    const imageIndex = currentGridImages.indexOf(image.url);
    
    // If image is already selected, remove it
    if (imageIndex !== -1) {
      const updatedGridImages = [...currentGridImages];
      updatedGridImages.splice(imageIndex, 1);
      onFieldChange('gridImages', updatedGridImages);
    } 
    // If image is not selected and we have less than 4 images, add it
    else if (currentGridImages.length < 4) {
      onFieldChange('gridImages', [...currentGridImages, image.url]);
    }
  };

  // Check if an image is the featured image
  const isFeaturedImage = (image: PropertyImage) => {
    return formData.featuredImage === image.url;
  };

  // Check if an image is in the grid images
  const isGridImage = (image: PropertyImage) => {
    return (formData.gridImages || []).includes(image.url);
  };

  // Grid images count
  const gridImagesCount = (formData.gridImages || []).length;
  const featuredImageSelected = !!formData.featuredImage;

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <Label className="text-lg font-medium">Image Selection</Label>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-muted-foreground text-sm">
            Please upload images in the Media tab first to select featured and grid images.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Featured Image</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select one image to be used as the featured image on coverpage and property listings.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div 
              key={`featured-${image.id}`}
              className={cn(
                "relative border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all",
                isFeaturedImage(image) && "ring-2 ring-primary"
              )}
              onClick={() => handleSelectFeaturedImage(image)}
            >
              <div className="aspect-square">
                <img 
                  src={image.url} 
                  alt="Property" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isFeaturedImage(image) && (
                <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {featuredImageSelected && (
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => onFieldChange('featuredImage', null)}
          >
            Clear Featured Image
          </Button>
        )}
      </div>
      
      <div className="mt-8">
        <Label className="text-lg font-medium">Grid Images</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select up to 4 images to be displayed in the grid on the coverpage. {gridImagesCount}/4 selected.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div 
              key={`grid-${image.id}`}
              className={cn(
                "relative border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all",
                isGridImage(image) && "ring-2 ring-primary"
              )}
              onClick={() => handleToggleGridImage(image)}
            >
              <div className="aspect-square">
                <img 
                  src={image.url} 
                  alt="Property" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isGridImage(image) && (
                <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {gridImagesCount > 0 && (
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => onFieldChange('gridImages', [])}
          >
            Clear Grid Images
          </Button>
        )}
      </div>
    </div>
  );
}
