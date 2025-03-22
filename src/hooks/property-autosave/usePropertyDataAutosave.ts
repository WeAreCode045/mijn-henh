
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";
import { preparePropertiesForJsonField } from "./preparePropertyData";

export function usePropertyDataAutosave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logPropertyChanges } = usePropertyEditLogger();

  const autosaveData = async (formData: PropertyFormData): Promise<boolean> => {
    if (!formData.id) return false;
    
    try {
      setIsSaving(true);
      
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', formData.id)
        .single();
      
      const submitData = {
        title: formData.title,
        price: formData.price,
        address: formData.address,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        livingArea: formData.livingArea,
        buildYear: formData.buildYear,
        garages: formData.garages,
        energyLabel: formData.energyLabel,
        hasGarden: formData.hasGarden,
        description: formData.description,
        shortDescription: formData.shortDescription,
        location_description: formData.location_description,
        features: JSON.stringify(formData.features),
        latitude: formData.latitude,
        longitude: formData.longitude,
        object_id: formData.object_id,
        agent_id: formData.agent_id,
        virtualTourUrl: formData.virtualTourUrl,
        youtubeUrl: formData.youtubeUrl,
        floorplanEmbedScript: formData.floorplanEmbedScript,
      };
      
      console.log('Auto-saving property data...', formData);

      // Don't include updated_at to let Supabase update it automatically
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(submitData)
        .eq('id', formData.id)
        .select(); // Add select to retrieve the updated data including the timestamp

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      console.log('Auto-save successful, new timestamp:', updatedData?.[0]?.updated_at);
      
      // Log all changes that occurred during autosave
      if (currentPropertyData) {
        await logPropertyChanges(formData.id, currentPropertyData, submitData);
      }
      
      // Handle floorplans if needed
      if (formData.floorplans && formData.floorplans.length > 0) {
        await handleFloorplans(formData);
      }
      
      return true;
    } catch (error: any) {
      console.error('Auto-save failed:', error);
      toast({
        title: "Auto-save Failed",
        description: error.message || "An error occurred during auto-save",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleFloorplans = async (formData: PropertyFormData) => {
    try {
      const { data: existingFloorplans } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', formData.id)
        .eq('type', 'floorplan');
        
      const existingUrls = existingFloorplans?.map(f => f.url) || [];
      
      for (const floorplan of formData.floorplans) {
        const floorplanUrl = typeof floorplan === 'string' ? floorplan : floorplan.url;
        if (!floorplanUrl || existingUrls.includes(floorplanUrl)) continue;
        
        await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: floorplanUrl,
            type: 'floorplan'
          });
      }
    } catch (error) {
      console.error('Error updating floorplans:', error);
    }
  };

  return {
    autosaveData,
    isSaving,
  };
}
