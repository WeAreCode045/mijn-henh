
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";
import { preparePropertiesForJsonField } from "./preparePropertyData";
import { usePropertyFloorplanSaver } from "./usePropertyFloorplanSaver";

export function usePropertyDataAutosave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logPropertyChanges } = usePropertyEditLogger();
  const { handleFloorplans } = usePropertyFloorplanSaver();

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
      
      // Prepare the features to be saved as JSON
      const featuresJson = Array.isArray(formData.features) 
        ? JSON.stringify(formData.features)
        : formData.features;
      
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
        features: featuresJson,
        latitude: formData.latitude,
        longitude: formData.longitude,
        object_id: formData.object_id,
        agent_id: formData.agent_id,
        virtualTourUrl: formData.virtualTourUrl,
        youtubeUrl: formData.youtubeUrl,
        floorplanEmbedScript: formData.floorplanEmbedScript,
      };
      
      console.log('Auto-saving property data...', formData);
      console.log('Submit data for database:', submitData);

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
      
      // Handle floorplans using the separate utility
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

  return {
    autosaveData,
    isSaving,
  };
}
