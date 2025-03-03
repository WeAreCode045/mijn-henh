
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageGrid } from "@/components/property/image-select/ImageGrid";
import { DialogTriggerButton } from "@/components/property/image-select/DialogTriggerButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageSelectionsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function ImageSelections({ formData, onFieldChange }: ImageSelectionsProps) {
  const [openFeaturedDialog, setOpenFeaturedDialog] = useState(false);
  const [openGridDialog, setOpenGridDialog] = useState(false);
  
  // Ensure arrays exist
  const images = formData.images || [];
  
  // Handle featured image selection
  const handleFeaturedImageSelect = (imageUrl: string) => {
    console.log("Selected featured image:", imageUrl);
    onFieldChange('featuredImage', imageUrl);
    setOpenFeaturedDialog(false);
  };
  
  // Handle grid image selection/toggle
  const handleGridImageToggle = (imageUrl: string) => {
    const currentGridImages = [...(formData.gridImages || [])];
    
    // If image is already in grid, remove it
    if (currentGridImages.includes(imageUrl)) {
      const updatedGridImages = currentGridImages.filter(url => url !== imageUrl);
      console.log("Removed image from grid:", imageUrl);
      console.log("Updated grid images:", updatedGridImages);
      onFieldChange('gridImages', updatedGridImages);
    } else {
      // If we already have 4 images, don't add more
      if (currentGridImages.length >= 4) {
        console.log("Cannot add more than 4 grid images");
        return;
      }
      // Add the image to the grid
      const updatedGridImages = [...currentGridImages, imageUrl];
      console.log("Added image to grid:", imageUrl);
      console.log("Updated grid images:", updatedGridImages);
      onFieldChange('gridImages', updatedGridImages);
    }
  };

  // Remove a grid image
  const handleRemoveGridImage = (index: number) => {
    const updatedGridImages = [...(formData.gridImages || [])];
    updatedGridImages.splice(index, 1);
    console.log("Removed grid image at index:", index);
    console.log("Updated grid images:", updatedGridImages);
    onFieldChange('gridImages', updatedGridImages);
  };

  // Remove featured image
  const handleRemoveFeaturedImage = () => {
    console.log("Removing featured image");
    onFieldChange('featuredImage', null);
  };

  return (
    <div className="space-y-6">
      {/* Featured Image Section */}
      <div className="space-y-2">
        <Label>Featured Image</Label>
        <p className="text-sm text-gray-500">
          Select one image to be featured on the property card, PDF cover, and web view.
        </p>
        
        {formData.featuredImage ? (
          <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={formData.featuredImage} 
              alt="Featured" 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={handleRemoveFeaturedImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <DialogTriggerButton 
            onClick={() => setOpenFeaturedDialog(true)}
            buttonText="Select Featured Image"
          />
        )}
        
        <Dialog open={openFeaturedDialog} onOpenChange={setOpenFeaturedDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Featured Image</DialogTitle>
            </DialogHeader>
            <ImageGrid 
              images={images.map(img => img.url)}
              selected={formData.featuredImage ? [formData.featuredImage] : []}
              onSelect={handleFeaturedImageSelect}
              selectionMode="single"
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Grid Images Section */}
      <div className="space-y-2">
        <Label>Grid Images (max 4)</Label>
        <p className="text-sm text-gray-500">
          Select up to 4 images to appear in the grid on the property card, PDF cover, and web view.
        </p>
        
        {formData.gridImages && formData.gridImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {formData.gridImages.map((imageUrl, index) => (
              <div key={index} className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={`Grid ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveGridImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {formData.gridImages.length < 4 && (
              <DialogTriggerButton 
                onClick={() => setOpenGridDialog(true)}
                buttonText="Add Grid Image"
                className="h-32"
              />
            )}
          </div>
        ) : (
          <DialogTriggerButton 
            onClick={() => setOpenGridDialog(true)}
            buttonText="Select Grid Images"
          />
        )}
        
        <Dialog open={openGridDialog} onOpenChange={setOpenGridDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Grid Images (max 4)</DialogTitle>
            </DialogHeader>
            <ImageGrid 
              images={images.map(img => img.url)}
              selected={formData.gridImages || []}
              onSelect={handleGridImageToggle}
              selectionMode="multiple"
              maxSelections={4}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
