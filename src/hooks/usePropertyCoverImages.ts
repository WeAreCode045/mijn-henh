
import { useState } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyCoverImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSetCoverImage = async (imageUrl: string, index: number) => {
    if (!formData.id) return;
    
    setIsUpdating(true);
    
    try {
      // Find the image object from formData.images that has this URL
      const imageObj = formData.images.find(img => img.url === imageUrl);
      
      if (!imageObj) {
        console.error("Image not found in property images");
        return;
      }
      
      // Update the database entry
      const { error } = await supabase
        .from('property_images')
        .update({ 
          is_featured_image: true,
          sort_order: index 
        })
        .eq('id', imageObj.id)
        .eq('property_id', formData.id);
        
      if (error) throw error;
      
      // Update the formData
      const updatedCoverImages = [...(formData.featuredImages || [])];
      
      // Add new image to position
      if (index >= updatedCoverImages.length) {
        // If index is beyond current array length, just append
        updatedCoverImages.push(imageUrl);
      } else {
        // If index is within array bounds, update at that position
        updatedCoverImages[index] = imageUrl;
      }
      
      // Create temporary backward compatibility field
      const tempCoverImages = updatedCoverImages.map(url => {
        const img = formData.images.find(i => i.url === url);
        return img || { id: "", url };
      });
      
      setFormData({
        ...formData,
        featuredImages: updatedCoverImages,
        // For backward compatibility
        coverImages: tempCoverImages
      });
      
      toast({
        title: "Success",
        description: `Cover image ${index + 1} updated`
      });
    } catch (error) {
      console.error("Error setting cover image:", error);
      toast({
        title: "Error",
        description: "Failed to update cover image",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSetCoverImage,
    isUpdating
  };
}
