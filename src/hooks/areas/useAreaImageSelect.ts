import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyArea, AreaImage } from '@/types/property';

export function useAreaImageSelect(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Handle the selection of images for an area
  const handleAreaImagesSelect = async (areaId: string, imageIds: string[]) => {
    console.log(`Selecting images for area ${areaId}:`, imageIds);
    
    try {
      // Find the area to update
      const areaToUpdate = formData.areas.find(area => area.id === areaId);
      
      if (!areaToUpdate) {
        console.error(`Area with ID ${areaId} not found`);
        throw new Error(`Area with ID ${areaId} not found`);
      }
      
      // Convert selected imageIds to the new areaImages format with sort order
      const areaImages: AreaImage[] = imageIds.map((id, index) => ({
        id: id,
        url: '', // Provide the appropriate URL here
        ImageID: id,
        imageSortOrder: index + 1
      }));
      
      // Update the areas with the selected images
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          return {
            ...area,
            areaImages: areaImages,
            // For backward compatibility, also update legacy fields
            imageIds: imageIds,
            images: formData.images
              ? formData.images.filter(img => {
                  if (typeof img === 'string') return imageIds.includes(img);
                  if (typeof img === 'object' && 'id' in img) return imageIds.includes(img.id);
                  return false;
                })
              : []
          };
        }
        return area;
      });
      
      // Update the form data with the selected images
      setFormData(prevData => ({
        ...prevData,
        areas: updatedAreas
      }));
      
      // If we have a property ID, update the property_images table
      if (formData.id) {
        console.log(`Updating area assignments for images in property_images table`);
        
        // First, clear all area assignments for this area
        const { error: clearError } = await supabase
          .from('property_images')
          .update({ area: null })
          .eq('property_id', formData.id)
          .eq('area', areaId);
          
        if (clearError) {
          console.error('Error clearing area assignments:', clearError);
          throw clearError;
        }
        
        // Then, assign the selected images to this area with proper sort order
        for (let i = 0; i < imageIds.length; i++) {
          const { error } = await supabase
            .from('property_images')
            .update({ 
              area: areaId,
              sort_order: i 
            })
            .eq('id', imageIds[i])
            .eq('property_id', formData.id);
            
          if (error) {
            console.error(`Error updating property_image ${imageIds[i]}:`, error);
            throw error;
          }
        }
      }
      
      toast({
        title: "Success",
        description: `${imageIds.length} images assigned to area`,
      });
      
    } catch (error) {
      console.error('Error assigning images to area:', error);
      toast({
        title: "Error",
        description: "Failed to assign images to area",
        variant: "destructive",
      });
    }
  };

  return {
    handleAreaImagesSelect
  };
}
