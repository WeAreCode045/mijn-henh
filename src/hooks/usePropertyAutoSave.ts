
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { prepareAreasForFormSubmission, preparePropertiesForJsonField } from "./property-form/preparePropertyData";

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
        technicalItems,
        floorplanEmbedScript
      } = formData;

      // If still new or draft state (no ID), return false
      if (!formData.id) {
        console.log('Property ID not available for auto-save');
        return false;
      }

      // Transform the features and areas to the correct JSON format
      const transformedAreas = prepareAreasForFormSubmission(areas);
      const transformedFeatures = preparePropertiesForJsonField(features);
      const transformedNearbyPlaces = preparePropertiesForJsonField(nearby_places || []);
      const transformedTechnicalItems = technicalItems ? JSON.stringify(technicalItems) : null;

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
        features: transformedFeatures,
        areas: transformedAreas,
        nearby_places: transformedNearbyPlaces,
        latitude,
        longitude,
        map_image,
        agent_id,
        virtualTourUrl,
        youtubeUrl,
        notes,
        template_id,
        technicalItems: transformedTechnicalItems,
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

      // Handle floorplans separately
      if (formData.floorplans && formData.floorplans.length > 0) {
        try {
          // First, get existing floorplans
          const { data: existingFloorplans } = await supabase
            .from('property_images')
            .select('id, url')
            .eq('property_id', formData.id)
            .eq('type', 'floorplan');
            
          const existingUrls = existingFloorplans?.map(f => f.url) || [];
          
          // Add new floorplans
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
          // Don't throw here, as the main save was successful
        }
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
