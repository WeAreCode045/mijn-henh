
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { prepareAreasForFormSubmission } from "./property-form/preparePropertyData";

export function usePropertyAutoSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Cleanup function for the timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const autosaveData = async (formData: PropertyFormData): Promise<boolean> => {
    // Don't save if there's no ID (new property that hasn't been saved initially)
    if (!formData.id) {
      console.log('No ID available, auto-save skipped');
      return false;
    }

    setIsSaving(true);
    console.log('Auto-saving property data...');

    try {
      // Extract the fields we want to update
      const {
        title,
        price,
        address,
        bedrooms,
        bathrooms,
        sqft,
        livingArea,
        buildYear,
        garages,
        energyLabel,
        hasGarden,
        description,
        location_description,
        features,
        areas,
        nearby_places,
        latitude,
        longitude,
        map_image,
        agent_id,
        virtualTourUrl,
        youtubeUrl,
        notes,
        template_id,
        floorplanEmbedScript
      } = formData;

      // If still new or draft state (no ID), return false
      if (!formData.id) {
        console.log('Property ID not available for auto-save');
        return false;
      }

      // Transform the areas to the correct JSON format
      const transformedAreas = prepareAreasForFormSubmission(areas);

      const updateData = {
        title,
        price,
        address,
        bedrooms,
        bathrooms,
        sqft,
        livingArea,
        buildYear,
        garages,
        energyLabel,
        hasGarden,
        description,
        location_description,
        features,
        areas: transformedAreas,
        nearby_places,
        latitude,
        longitude,
        map_image,
        agent_id,
        virtualTourUrl,
        youtubeUrl,
        notes,
        template_id,
        floorplanEmbedScript
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', formData.id);

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      setLastSaved(new Date());
      setPendingChanges(false);
      console.log('Auto-save successful');
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
    lastSaved,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}
