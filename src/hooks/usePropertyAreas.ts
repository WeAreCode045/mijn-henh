
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyArea, PropertyFormData, PropertyImage } from '@/types/property';

export function usePropertyAreas(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Add a new area to the property
  const addArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      imageIds: [],
      columns: 2 // Default to 2 columns
    };
    
    console.log("Adding new area with default columns:", newArea);
    
    setFormData({
      ...formData,
      areas: [...(formData.areas || []), newArea],
    });
  };

  // Remove an area from the property
  const removeArea = (id: string) => {
    console.log(`Removing area ${id}`);
    
    setFormData({
      ...formData,
      areas: formData.areas.filter(area => area.id !== id),
    });
  };

  // Update a specific field of an area
  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number) => {
    console.log(`Updating area ${id}, field ${String(field)}, value:`, value);
    
    const updatedAreas = formData.areas.map(area => 
      area.id === id ? { ...area, [field]: value } : area
    );
    
    setFormData({
      ...formData,
      areas: updatedAreas,
    });
    
    // Log the updated areas for debugging
    console.log("Areas after update:", updatedAreas);
  };

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
              type: 'image'
            })
            .select('id')
            .single();
            
          if (dbError) {
            console.error('Database error saving image:', dbError);
            throw dbError;
          }
          
          // Return the database record ID and URL
          return { id: imageData.id, url: publicUrl };
        }
        
        // If no property ID yet, just return a temporary ID
        return { id: crypto.randomUUID(), url: publicUrl };
      });
      
      const newImages = await Promise.all(uploadPromises);
      console.log("Uploaded new images:", newImages);
      
      // Find the area to update
      const areaToUpdate = formData.areas.find(area => area.id === areaId);
      
      if (!areaToUpdate) {
        console.error(`Area with ID ${areaId} not found`);
        throw new Error(`Area with ID ${areaId} not found`);
      }
      
      // Add the new image IDs to the area
      const updatedImageIds = [...(areaToUpdate.imageIds || []), ...newImages.map(img => img.id)];
      console.log(`Updating area ${areaId} with new imageIds:`, updatedImageIds);
      
      // Create updated areas array with the new imageIds
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            imageIds: updatedImageIds
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

  // Remove an image from an area
  const handleAreaImageRemove = async (areaId: string, imageId: string) => {
    console.log(`Removing image ${imageId} from area ${areaId}`);
    
    try {
      // Find the image to get its URL
      const imageToRemove = formData.images.find(img => img.id === imageId);
      
      if (!imageToRemove) {
        console.error(`Image with ID ${imageId} not found`);
        throw new Error(`Image with ID ${imageId} not found`);
      }
      
      // First update the area's imageIds in the local state
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          const updatedImageIds = (area.imageIds || []).filter(id => id !== imageId);
          console.log(`Updating area ${areaId} imageIds after removal:`, updatedImageIds);
          return {
            ...area,
            imageIds: updatedImageIds
          };
        }
        return area;
      });
      
      // Update the form data with the modified areas
      setFormData({
        ...formData,
        areas: updatedAreas
      });
      
      // If we have a property ID, also remove from the database
      if (formData.id && imageToRemove) {
        // Try to remove from property_images table
        // Note: We don't remove from storage to avoid breaking other references
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', imageId)
          .eq('property_id', formData.id);
          
        if (error) {
          console.error('Error removing image from database:', error);
          throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "Image removed from area",
      });
      
    } catch (error) {
      console.error('Error removing image from area:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  // Select images from existing property images for an area
  const handleAreaImagesSelect = (areaId: string, imageIds: string[]) => {
    console.log(`Selecting images for area ${areaId}, imageIds:`, imageIds);
    
    const updatedAreas = formData.areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          imageIds: imageIds,
        };
      }
      return area;
    });
    
    setFormData({
      ...formData,
      areas: updatedAreas,
    });
    
    const areaTitle = formData.areas.find(a => a.id === areaId)?.title || 'area';
    
    toast({
      title: "Success",
      description: `Updated images for "${areaTitle}"`,
    });
  };

  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    isUploading
  };
}
