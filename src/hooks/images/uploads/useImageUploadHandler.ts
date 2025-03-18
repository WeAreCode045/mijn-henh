import { useState } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

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
      
      // Find the highest sort_order for images only (not floorplans)
      let highestSortOrder = 0;
      
      // First check the current state images
      currentImages.forEach(img => {
        if (typeof img === 'object' && img.sort_order && img.sort_order > highestSortOrder) {
          highestSortOrder = img.sort_order;
        }
      });
      
      // If we have a property ID, also check the database for the highest sort_order
      if (formData.id) {
        const { data, error } = await supabase
          .from('property_images')
          .select('sort_order')
          .eq('property_id', formData.id)
          .eq('type', 'image')
          .order('sort_order', { ascending: false })
          .limit(1);
          
        if (!error && data && data.length > 0 && data[0].sort_order) {
          highestSortOrder = Math.max(highestSortOrder, data[0].sort_order);
        }
      }

      console.log("Starting upload for", files.length, "files. Property ID:", formData.id);

      // Process each file
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = formData.id 
          ? `properties/${formData.id}/${fileName}`
          : `temp/${fileName}`;

        console.log("Uploading file to path:", filePath);

        // Upload to storage - CORRECTED BUCKET NAME
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(`Error uploading image: ${uploadError.message}`);
          continue;
        }

        // Get public URL - CORRECTED BUCKET NAME
        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Could not get public URL');
          continue;
        }

        console.log("File uploaded successfully, public URL:", publicUrlData.publicUrl);

        // Increment the sort_order for each new image
        highestSortOrder += 1;

        // Create image record in database if we have a property ID
        if (formData.id) {
          console.log("Creating database record for image with property_id:", formData.id);
          const { error: dbError, data: imageData } = await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              type: 'image',
              url: publicUrlData.publicUrl,
              sort_order: highestSortOrder // Assign sort_order
            })
            .select()
            .single();

          if (dbError) {
            console.error('Error recording image in database:', dbError);
            toast.error(`Error saving image reference: ${dbError.message}`);
          } else {
            console.log("Database record created successfully:", imageData);
            
            // Use the returned database ID if available
            newImages.push({
              id: imageData.id || Date.now().toString() + Math.random().toString(),
              url: publicUrlData.publicUrl,
              sort_order: highestSortOrder
            });
          }
        } else {
          // If no property ID, just use a temporary ID
          newImages.push({
            id: Date.now().toString() + Math.random().toString(),
            url: publicUrlData.publicUrl,
            sort_order: highestSortOrder
          });
        }
      }

      // Update form data with new images
      console.log("Adding new images to form state:", newImages);
      setFormData({
        ...formData,
        images: [...currentImages, ...newImages].map(img => typeof img === 'string' ? 
          { id: `img-${Date.now()}-${Math.random()}`, url: img, type: "image" as const } : 
          { ...img, type: img.type || "image" as const })
      });
      
      if (newImages.length > 0) {
        toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded successfully`);
      }
      
    } catch (error) {
      console.error('Error in image upload:', error);
      toast.error('Error uploading images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return { handleImageUpload };
}
