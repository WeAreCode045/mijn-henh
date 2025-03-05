
import { useState } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export function useImageUploadHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void,
  setIsUploading: (isUploading: boolean) => void
) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const files = Array.from(e.target.files);
    const newImages: PropertyImage[] = [];

    try {
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      
      // Find the highest sort_order
      let highestSortOrder = 0;
      currentImages.forEach(img => {
        if (typeof img === 'object' && img.sort_order && img.sort_order > highestSortOrder) {
          highestSortOrder = img.sort_order;
        }
      });

      // Process each file
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${formData.id ? formData.id : 'temp'}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Could not get public URL');
          continue;
        }

        // Increment the sort_order for each new image
        highestSortOrder += 1;

        // Create image record in database if we have a property ID
        if (formData.id) {
          const { error: dbError } = await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              type: 'image',
              url: publicUrlData.publicUrl,
              sort_order: highestSortOrder // Assign sort_order
            });

          if (dbError) {
            console.error('Error recording image in database:', dbError);
          }
        }

        // Add to new images array
        newImages.push({
          id: Date.now().toString() + Math.random().toString(),
          url: publicUrlData.publicUrl,
          sort_order: highestSortOrder // Include sort_order in the image object
        });
      }

      // Update form data with new images
      setFormData({
        ...formData,
        images: [...currentImages, ...newImages]
      });
      
    } catch (error) {
      console.error('Error in image upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return { handleImageUpload };
}
