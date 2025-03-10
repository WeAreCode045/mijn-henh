
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from '@/types/property';

export function useAreaImageUpload(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Handle image upload for a specific area
  const handleAreaImageUpload = async (areaId: string, files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      console.log(`Uploading ${files.length} images for area ${areaId}`);
      
      const uploadPromises = Array.from(files).map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/areas/${areaId}/${fileName}`;
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        // Save to property_images table if we have a property ID
        if (formData.id) {
          const { data: imageData, error: dbError } = await supabase
            .from('property_images')
            .insert({
              property_id: formData.id,
              url: publicUrl,
              type: 'image',
              area: areaId // Directly assign to the area
            })
            .select('id')
            .single();
            
          if (dbError) {
            console.error('Database error saving image:', dbError);
            throw dbError;
          }
          
          // Return the database record ID and URL
          return { id: imageData.id, url: publicUrl } as PropertyImage;
        }
        
        // If no property ID yet, just return a temporary ID
        return { id: crypto.randomUUID(), url: publicUrl } as PropertyImage;
      });
      
      const newImages = await Promise.all(uploadPromises);
      console.log("Uploaded new images:", newImages);
      
      // Find the area to update
      const areaToUpdate = formData.areas.find(area => area.id === areaId);
      
      if (!areaToUpdate) {
        console.error(`Area with ID ${areaId} not found`);
        throw new Error(`Area with ID ${areaId} not found`);
      }
      
      // Create updated areas array with the new images
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            images: [...(area.images || []), ...newImages]
          };
        }
        return area;
      });
      
      // Add the new images to the form data images array
      const updatedImages = [...(formData.images || []), ...newImages];
      
      // Update form data with both new images and updated area
      setFormData({
        ...formData,
        images: updatedImages,
        areas: updatedAreas
      });
      
      toast({
        title: "Success",
        description: `Uploaded ${newImages.length} images to ${areaToUpdate.title || areaId}`,
      });
      
    } catch (error) {
      console.error('Error uploading area images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleAreaImageUpload,
    isUploading
  };
}
