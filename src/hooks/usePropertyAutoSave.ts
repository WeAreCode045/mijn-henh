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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const autosaveData = async (formData: PropertyFormData): Promise<boolean> => {
    if (!formData.id) {
      console.log('No ID available, auto-save skipped');
      return false;
    }

    setIsSaving(true);
    console.log('Auto-saving property data...', formData);

    try {
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

      if (!formData.id) {
        console.log('Property ID not available for auto-save');
        return false;
      }

      const transformedAreas = prepareAreasForFormSubmission(areas);
      const transformedFeatures = preparePropertiesForJsonField(features);
      const transformedNearbyPlaces = preparePropertiesForJsonField(nearby_places || []);
      
      const technicalItemsArray = Array.isArray(technicalItems) ? technicalItems : [];
      const transformedTechnicalItems = preparePropertiesForJsonField(technicalItemsArray);
      
      console.log('Transformed technical items:', transformedTechnicalItems);
      console.log('floorplanEmbedScript for autosave:', floorplanEmbedScript);

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

      console.log('Saving to database:', updateData);

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', formData.id);

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      if (formData.floorplans && formData.floorplans.length > 0) {
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
