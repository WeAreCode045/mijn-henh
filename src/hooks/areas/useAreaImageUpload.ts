
import { useState } from 'react';
import { PropertyFormData, PropertyImage } from '@/types/property';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAreaImageUpload(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);

  // Upload images specifically for an area
  const handleAreaImageUpload = async (areaId: string, files: FileList): Promise<void> => {
    if (!files || files.length === 0) {
      return Promise.resolve();
    }

    setIsUploading(true);
    const fileArray = Array.from(files);
    
    try {
      // Find the area to update
      const areaIndex = formData.areas.findIndex(area => area.id === areaId);
      if (areaIndex === -1) {
        throw new Error(`Area with ID ${areaId} not found`);
      }

      const areaToUpdate = formData.areas[areaIndex];
      const uploadedImages: PropertyImage[] = [];

      // Process each file
      for (const file of fileArray) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = formData.id 
          ? `properties/${formData.id}/areas/${areaId}/${fileName}`
          : `temp/areas/${areaId}/${fileName}`;

        console.log("Uploading area image to path:", filePath);

        // Upload to storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading area image:', uploadError);
          toast.error(`Error uploading area image: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Could not get public URL for area image');
          continue;
        }

        console.log("Area image uploaded successfully, public URL:", publicUrlData.publicUrl);

        // Create image record
        const newImage: PropertyImage = {
          id: uuidv4(),
          url: publicUrlData.publicUrl,
          property_id: formData.id,
          area: areaId,
          type: 'area',
          sort_order: (areaToUpdate.images?.length || 0) + uploadedImages.length + 1
        };

        // If we have a property ID, store in database
        if (formData.id) {
          console.log("Creating database record for area image");
          const { error: dbError, data: imageData } = await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              url: publicUrlData.publicUrl,
              type: 'area',
              area: areaId,
              sort_order: newImage.sort_order
            })
            .select()
            .single();

          if (dbError) {
            console.error('Error recording area image in database:', dbError);
            toast.error(`Error saving area image reference: ${dbError.message}`);
          } else if (imageData) {
            newImage.id = imageData.id;
            console.log("Database record created for area image:", imageData);
          }
        }

        uploadedImages.push(newImage);
      }

      // Update the form state with new area images
      if (uploadedImages.length > 0) {
        const updatedArea = {
          ...areaToUpdate,
          images: [...(areaToUpdate.images || []), ...uploadedImages]
        };

        const updatedAreas = [...formData.areas];
        updatedAreas[areaIndex] = updatedArea;

        setFormData({
          ...formData,
          areas: updatedAreas
        });

        toast.success(`${uploadedImages.length} area image${uploadedImages.length > 1 ? 's' : ''} uploaded`);
      }

    } catch (error) {
      console.error('Error handling area image upload:', error);
      toast.error('Failed to upload area images');
    } finally {
      setIsUploading(false);
    }
    
    return Promise.resolve();
  };

  return {
    handleAreaImageUpload,
    isUploading
  };
}
