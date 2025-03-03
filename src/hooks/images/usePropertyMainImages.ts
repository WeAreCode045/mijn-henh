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
        const { error } = await supabase
          .from('properties')
          .update({ featuredImage: url })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Error updating featured image in database:", error);
          toast({
            title: "Error",
            description: "Failed to update featured image in database",
            variant: "destructive"
          });
          return;
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
    
    // If image is already in grid, remove it
    if (currentGridImages.includes(url)) {
      updatedGridImages = currentGridImages.filter(imageUrl => imageUrl !== url);
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
          .from('properties')
          .update({ gridImages: updatedGridImages })
          .eq('id', formData.id);
          
        if (error) {
          console.error("Error updating grid images in database:", error);
          toast({
            title: "Error",
            description: "Failed to update grid images in database",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Grid images updated successfully",
        });
      } catch (error) {
        console.error("Error updating grid images:", error);
        toast({
          title: "Error",
          description: "Failed to update grid images",
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
