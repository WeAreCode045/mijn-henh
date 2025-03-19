
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyImage } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';

export function useAreaImageUpload(
  formData: PropertyFormData,
  setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Handle area image upload
  const handleAreaImageUpload = useCallback(async (areaId: string, files: FileList): Promise<void> => {
    if (!files || files.length === 0 || !formData.id) return;
    
    setIsUploading(true);
    
    try {
      const newImages: PropertyImage[] = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create a unique file name
        const fileName = `${formData.id}/${areaId}/${uuidv4()}-${file.name}`;
        
        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('property_images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });
          
        if (error) {
          console.error('Error uploading area image:', error);
          continue;
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('property_images')
          .getPublicUrl(data.path);
          
        if (!publicUrlData || !publicUrlData.publicUrl) continue;
        
        // Create a new PropertyImage object
        const newImage: PropertyImage = {
          id: uuidv4(),
          url: publicUrlData.publicUrl,
          property_id: formData.id,
          area: areaId,
          is_featured_image: false,
          type: 'area',
        };
        
        // Add to the new images array
        newImages.push(newImage);
      }
      
      // Update the form state with the new images
      setFormState(prevState => {
        // Find the area that needs to be updated
        const updatedAreas = prevState.areas.map(area => {
          if (area.id === areaId) {
            return {
              ...area,
              images: [...(area.images || []), ...newImages],
            };
          }
          return area;
        });
        
        // Add the new images to the global images array
        return {
          ...prevState,
          areas: updatedAreas,
          images: [...(prevState.images || []), ...newImages],
        };
      });
      
    } catch (error) {
      console.error('Error in handleAreaImageUpload:', error);
    } finally {
      setIsUploading(false);
    }
  }, [formData, setFormState, setIsUploading]);
  
  return {
    handleAreaImageUpload
  };
}
