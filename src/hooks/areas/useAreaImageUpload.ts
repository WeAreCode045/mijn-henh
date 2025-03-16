
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData, PropertyImage } from "@/types/property";

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
            type: 'image', // Use a string that matches the allowed type values
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
        uploadedImages.push(imageData as PropertyImage);
      }
      
      // Update the form state with the new image IDs
      setFormState(prevData => {
        const updatedAreas = prevData.areas?.map(area => {
          if (area.id === areaId) {
            return {
              ...area,
              imageIds: [...(area.imageIds || []), ...uploadedImageIds],
              images: [...(area.images || []), ...uploadedImages]
            };
          }
          return area;
        }) || [];
        
        return {
          ...prevData,
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
