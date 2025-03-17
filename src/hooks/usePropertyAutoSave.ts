
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

  // Add a debounced autosave effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scheduleAutosave = (formData: PropertyFormData) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!formData.id || !pendingChanges) return;
    
    console.log("Scheduling autosave for data with ID:", formData.id);
    
    // Set a timeout to trigger autosave after 1.5 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      autosaveData(formData);
    }, 1500);
  };

  const autosaveData = async (formData: PropertyFormData): Promise<boolean> => {
    if (!formData.id) return false;
    
    try {
      setIsSaving(true);
      
      // Prepare general information if it exists
      let generalInfoJson;
      if (formData.generalInfo) {
        generalInfoJson = typeof formData.generalInfo === 'string'
          ? formData.generalInfo
          : JSON.stringify(formData.generalInfo);
      }
      
      // Transform areas to the correct format for the database
      const areasForDb = prepareAreasForFormSubmission(formData.areas || []);
      
      // Transform JSON fields to strings
      const featuresJson = typeof formData.features === 'string' 
        ? formData.features 
        : JSON.stringify(formData.features || []);
      
      const nearby_placesJson = typeof formData.nearby_places === 'string'
        ? formData.nearby_places
        : JSON.stringify(formData.nearby_places || []);
      
      const nearby_citiesJson = typeof formData.nearby_cities === 'string'
        ? formData.nearby_cities
        : JSON.stringify(formData.nearby_cities || []);
      
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
        shortDescription: formData.shortDescription || "",
        location_description: formData.location_description,
        features: featuresJson,
        areas: areasForDb,
        nearby_places: nearby_placesJson,
        nearby_cities: nearby_citiesJson,
        latitude: formData.latitude,
        longitude: formData.longitude,
        map_image: formData.map_image,
        object_id: formData.object_id,
        agent_id: formData.agent_id,
        template_id: formData.template_id,
        virtualTourUrl: formData.virtualTourUrl,
        youtubeUrl: formData.youtubeUrl,
        floorplanEmbedScript: formData.floorplanEmbedScript || "",
        generalInfo: generalInfoJson
      };
      
      console.log('Auto-saving property data...', formData.id);

      const { error } = await supabase
        .from('properties')
        .update(submitData)
        .eq('id', formData.id);

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      // Check for floorplans that need to be saved
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
      console.log('Auto-save successful for property ID:', formData.id);
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
    scheduleAutosave,
    isSaving,
    lastSaved,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}
