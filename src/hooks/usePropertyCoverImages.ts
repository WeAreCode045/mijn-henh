
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyCoverImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSetFeaturedImage = async (url: string) => {
    if (!formData.id || !url) return;

    setIsUpdating(true);
    try {
      setFormData({
        ...formData,
        featuredImage: url
      });

      if (formData.id) {
        // Update in database - use is_main instead of is_featured
        await supabase
          .from('property_images')
          .update({ is_main: false })
          .eq('property_id', formData.id);

        await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', formData.id)
          .eq('url', url);
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
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCoverImage = async (url: string) => {
    if (!url) return;

    setIsUpdating(true);
    try {
      const currentCoverImages = formData.coverImages || [];
      const isInCover = currentCoverImages.includes(url);

      let updatedCoverImages;
      if (isInCover) {
        updatedCoverImages = currentCoverImages.filter(img => img !== url);
      } else {
        updatedCoverImages = [...currentCoverImages, url];
      }

      setFormData({
        ...formData,
        coverImages: updatedCoverImages
      });

      if (formData.id) {
        // Update in database - use is_featured_image instead of is_grid_image
        await supabase
          .from('property_images')
          .update({ is_featured_image: !isInCover })
          .eq('property_id', formData.id)
          .eq('url', url);
      }

      toast({
        title: "Success",
        description: isInCover 
          ? "Image removed from cover" 
          : "Image added to cover",
      });
    } catch (error) {
      console.error("Error toggling cover image:", error);
      toast({
        title: "Error",
        description: "Failed to update cover image",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSetFeaturedImage,
    handleToggleCoverImage,
    isUpdating
  };
}
