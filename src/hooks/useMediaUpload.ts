
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyImage, PropertyFormData } from "@/types/property";

export function useMediaUpload(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // This function handles file uploads for main property images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Sanitize the file name to remove non-ASCII characters
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        
        // Create a unique file name with UUID to prevent collisions
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        
        // Define the file path in the storage bucket - Using media subfolder
        const filePath = `properties/${formData.id || 'new'}/media/${fileName}`;
        
        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        // Return a new PropertyImage object
        return {
          id: crypto.randomUUID(),
          url: publicUrl,
          filePath // Store the file path for potential deletion later
        };
      });
      
      // Wait for all uploads to complete
      const newImages = await Promise.all(uploadPromises);
      
      // Create a new array with all existing and new images
      // Ensure images is an array even if it's not defined in formData
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      const updatedImages = [...currentImages, ...newImages];
      
      // Log for debugging
      console.log("Previous images:", currentImages);
      console.log("New images:", newImages);
      console.log("Updated images:", updatedImages);
      
      // Create a completely new object for React state detection
      const updatedFormData = {
        ...formData,
        images: updatedImages
      };
      
      // Update form state
      setFormData(updatedFormData);
      
      // If the property is already saved in the database, update it immediately
      if (formData.id) {
        try {
          // Add images to the property_images table for tracking
          for (const image of newImages) {
            const { error } = await supabase
              .from('property_images')
              .insert({
                property_id: formData.id,
                url: image.url,
                type: 'image' // Set type as 'image' to distinguish from floorplans
              });
              
            if (error) {
              console.error('Error adding image to database:', error);
            }
          }
        } catch (error) {
          console.error('Exception updating images in database:', error);
        }
      }
      
      toast({
        title: "Success",
        description: `${newImages.length} image${newImages.length === 1 ? '' : 's'} uploaded successfully`,
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
    }
  };

  // This function handles the removal of images
  const handleRemoveImage = async (index: number) => {
    // Ensure images array exists
    if (!Array.isArray(formData.images) || index < 0 || index >= formData.images.length) {
      console.error('Invalid image index or images array is not defined');
      return;
    }
    
    // Get the image to be removed
    const imageToRemove = formData.images[index];
    
    // Create a copy of the images array without the removed image
    const updatedImages = formData.images.filter((_, i) => i !== index);
    
    // Update the featured image if it was removed
    let updatedFeaturedImage = formData.featuredImage;
    if (formData.featuredImage === imageToRemove.url) {
      updatedFeaturedImage = null;
    }
    
    // Update grid images if they include the removed image
    const updatedGridImages = (formData.gridImages || []).filter(url => url !== imageToRemove.url);
    
    // Create an updated form data object
    const updatedFormData = {
      ...formData,
      images: updatedImages,
      featuredImage: updatedFeaturedImage,
      gridImages: updatedGridImages
    };
    
    // Update the form state
    setFormData(updatedFormData);
    
    // Attempt to delete the file from storage if file path exists
    if (imageToRemove.filePath) {
      try {
        const { error } = await supabase.storage
          .from('properties')
          .remove([imageToRemove.filePath]);
          
        if (error) {
          console.error('Error deleting image from storage:', error);
        }
      } catch (error) {
        console.error('Error in file deletion process:', error);
      }
    }
    
    // If property exists in database, update the property_images table
    if (formData.id && imageToRemove.url) {
      try {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('url', imageToRemove.url)
          .eq('property_id', formData.id)
          .eq('type', 'image');
          
        if (error) {
          console.error('Error removing image from database:', error);
        }
      } catch (error) {
        console.error('Error removing image from database:', error);
      }
    }
    
    toast({
      title: "Success",
      description: "Image removed successfully",
    });
  };

  // When fetching images, get them from property_images table and filter out floorplans
  const fetchImages = async (propertyId: string) => {
    if (!propertyId) return [];
    
    try {
      console.log("Fetching images for property:", propertyId);
      
      const { data, error } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', propertyId)
        .eq('type', 'image')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching images:", error);
        throw error;
      }
      
      console.log("Fetched images:", data);
      return data || [];
    } catch (error) {
      console.error('Error fetching property images:', error);
      return [];
    }
  };

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    fetchImages,
    images: formData?.images || []
  };
}
