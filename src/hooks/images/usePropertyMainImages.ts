
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { useState } from "react";

export function usePropertyMainImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        const { data, error } = await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: publicUrl
          })
          .select('id, url')
          .single();

        if (error) throw error;

        return data as PropertyImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Ensure images is always an array
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      
      const newImagesState = [...currentImages, ...uploadedImages];
      
      // Update form data with new images
      setFormData({
        ...formData,
        images: newImagesState
      });

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the input value to allow uploading the same file again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    console.log("Removing image at index:", index);
    
    if (!Array.isArray(formData.images) || index < 0 || index >= formData.images.length) {
      console.error('Invalid image index or images array is not defined');
      return;
    }

    const imageToRemove = formData.images[index];
    if (!imageToRemove || !imageToRemove.id) {
      console.error('Image not found or has no ID');
      return;
    }

    try {
      // Delete the image from the database
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageToRemove.id);

      if (error) throw error;
      
      // If this was the featured image, clear it
      let updatedFeaturedImage = formData.featuredImage;
      if (formData.featuredImage === imageToRemove.url) {
        updatedFeaturedImage = null;
        
        // Update featuredImage in the database if we have an ID
        if (formData.id) {
          await supabase
            .from('properties')
            .update({ featuredImage: null })
            .eq('id', formData.id);
        }
      }
      
      // If this was in grid images, remove it
      const updatedGridImages = (formData.gridImages || []).filter(url => url !== imageToRemove.url);
      
      // Update gridImages in the database if we have an ID and there's a change
      if (formData.id && updatedGridImages.length !== (formData.gridImages || []).length) {
        await supabase
          .from('properties')
          .update({ gridImages: updatedGridImages })
          .eq('id', formData.id);
      }

      // Create a new images array without the removed image
      const updatedImages = formData.images.filter((_, i) => i !== index);
      
      // Update form data with the new state
      setFormData({
        ...formData,
        images: updatedImages,
        featuredImage: updatedFeaturedImage,
        gridImages: updatedGridImages
      });

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    images: formData?.images || []
  };
}
