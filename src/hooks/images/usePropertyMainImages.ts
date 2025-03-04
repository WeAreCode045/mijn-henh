
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyMainImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  
  // Set featured image
  const handleSetFeaturedImage = async (url: string | null) => {
    console.log("Setting featured image:", url);
    
    // Update form data
    const updatedFormData = {
      ...formData,
      featuredImage: url
    };
    
    setFormData(updatedFormData);
    
    // Update in database if we have a property ID
    if (formData.id) {
      try {
        // First, unset all featured images
        const { error: clearError } = await supabase
          .from('property_images')
          .update({ is_featured: false })
          .eq('property_id', formData.id);
          
        if (clearError) {
          console.error("Error clearing featured images in database:", clearError);
          toast({
            title: "Error",
            description: "Failed to clear featured images in database",
            variant: "destructive"
          });
          return;
        }
        
        // Then set the new featured image
        if (url) {
          const { error } = await supabase
            .from('property_images')
            .update({ is_featured: true })
            .eq('property_id', formData.id)
            .eq('url', url);
            
          if (error) {
            console.error("Error updating featured image in database:", error);
            toast({
              title: "Error",
              description: "Failed to update featured image in database",
              variant: "destructive"
            });
            return;
          }
          
          console.log("Featured image set successfully in database");
        }
        
        toast({
          title: "Success",
          description: "Featured image updated successfully",
        });
      } catch (error) {
        console.error("Error updating featured image:", error);
        toast({
          title: "Error",
          description: "Failed to update featured image",
          variant: "destructive"
        });
      }
    }
  };
  
  // Toggle grid image (add or remove)
  const handleToggleGridImage = async (url: string) => {
    console.log("Toggling grid image:", url);
    
    // Get current grid images
    const currentGridImages = [...(formData.gridImages || [])];
    
    let updatedGridImages: string[];
    let newIsGridValue: boolean;
    
    // If image is already in grid, remove it
    if (currentGridImages.includes(url)) {
      updatedGridImages = currentGridImages.filter(imageUrl => imageUrl !== url);
      newIsGridValue = false;
    } else {
      // Otherwise add it (max 4)
      if (currentGridImages.length >= 4) {
        toast({
          title: "Warning",
          description: "You can only select up to 4 grid images.",
        });
        return;
      }
      updatedGridImages = [...currentGridImages, url];
      newIsGridValue = true;
    }
    
    // Update form data
    const updatedFormData = {
      ...formData,
      gridImages: updatedGridImages
    };
    
    setFormData(updatedFormData);
    
    // Update in database if we have a property ID
    if (formData.id) {
      try {
        const { error } = await supabase
          .from('property_images')
          .update({ is_grid_image: newIsGridValue })
          .eq('property_id', formData.id)
          .eq('url', url);
          
        if (error) {
          console.error("Error updating grid image in database:", error);
          toast({
            title: "Error",
            description: "Failed to update grid image in database",
            variant: "destructive"
          });
          return;
        }
        
        console.log("Grid image updated successfully in database");
        
        toast({
          title: "Success",
          description: "Grid image updated successfully",
        });
      } catch (error) {
        console.error("Error updating grid image:", error);
        toast({
          title: "Error",
          description: "Failed to update grid image",
          variant: "destructive"
        });
      }
    }
  };
  
  return {
    handleSetFeaturedImage,
    handleToggleGridImage
  };
}
