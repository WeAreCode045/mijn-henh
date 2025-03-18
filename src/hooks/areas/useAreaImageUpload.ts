
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData, PropertyImage, PropertyArea } from "@/types/property";
import { normalizeImage } from "@/utils/imageHelpers";
import { convertToPropertyImageArray } from '@/utils/propertyDataAdapters';

export function useAreaImageUpload(property_id: string, areaId: string, imageIds: string[], setFormState: React.Dispatch<React.SetStateAction<PropertyFormData>>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleAreaImageUpload = async (files: FileList) => {
    setIsLoading(true);
    setError(null);
    
    const uploadedImageIds: string[] = [];
    const uploadedImages: PropertyImage[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file) {
          console.warn('No file selected');
          continue;
        }
        
        // Create form data for Supabase storage upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload the file to Supabase Storage
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('properties')
          .upload(`${property_id}/areas/${crypto.randomUUID()}`, file);
            
        if (uploadError) {
          console.error('Error uploading area image:', uploadError);
          setError(uploadError.message);
          continue;
        }
          
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(fileData.path);
            
        // Save the image to property_images table
        const { data: imageData, error: imageError } = await supabase
          .from('property_images')
          .insert({
            property_id,
            area: areaId,
            url: publicUrl,
            type: 'image',
            sort_order: imageIds.length + i
          })
          .select('*')
          .single();
            
        if (imageError) {
          console.error('Error saving area image to database:', imageError);
          setError(imageError.message);
          continue;
        }
          
        // Add the image ID to the list
        uploadedImageIds.push(imageData.id);
        
        // Create a normalized image object
        const normalizedImage: PropertyImage = {
          id: imageData.id,
          url: imageData.url,
          area: imageData.area,
          property_id: imageData.property_id,
          is_main: imageData.is_main,
          is_featured_image: imageData.is_featured_image,
          sort_order: imageData.sort_order,
          type: imageData.type as "image" | "floorplan"
        };
        
        uploadedImages.push(normalizedImage);
      }
      
      // Update the form state with the new image IDs
      setFormState(prevFormData => {
        // Create a deep copy of the areas array
        const updatedAreas = prevFormData.areas.map(area => {
          if (area.id === areaId) {
            // Create a copy of this specific area with updated imageIds and images
            return {
              ...area,
              imageIds: [...(area.imageIds || []), ...uploadedImageIds],
              images: [...(area.images || []), ...uploadedImages]
            };
          }
          return area;
        });
        
        // Return the updated form data
        return {
          ...prevFormData,
          areas: updatedAreas
        };
      });
      
      toast({
        title: "Success",
        description: "Area images uploaded successfully.",
      });
    } catch (e: any) {
      console.error("Upload failed:", e);
      setError(e.message);
      toast({
        title: "Error",
        description: "Failed to upload area images.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return { handleAreaImageUpload, isLoading, error };
}
