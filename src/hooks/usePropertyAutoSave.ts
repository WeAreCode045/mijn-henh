
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { preparePropertiesForJsonField } from "./property-form/preparePropertyData";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertyAutoSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { logPropertyChanges } = usePropertyEditLogger();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const autosaveField = async <K extends keyof PropertyFormData>(
    propertyId: string,
    field: K,
    value: PropertyFormData[K]
  ): Promise<boolean> => {
    if (!propertyId) return false;
    
    try {
      setIsSaving(true);
      
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      // Prepare the field value for database submission
      let fieldValue = value;
      
      // Special handling for specific field types
      if (field === 'features' && Array.isArray(value)) {
        fieldValue = JSON.stringify(preparePropertiesForJsonField(value)) as any;
      } else if (field === 'areas' && Array.isArray(value)) {
        // Handle areas specially
        fieldValue = value.map(area => ({
          id: area.id,
          name: area.name || '',
          title: area.title || '',
          description: area.description || '',
          size: area.size || '',
          columns: area.columns || 2,
          imageIds: area.imageIds || [],
          images: area.images || [],
          areaImages: area.areaImages || []
        })) as any;
      } else if (field === 'nearby_places' && Array.isArray(value)) {
        fieldValue = JSON.stringify(preparePropertiesForJsonField(value)) as any;
      } else if (field === 'nearby_cities' && Array.isArray(value)) {
        fieldValue = JSON.stringify(preparePropertiesForJsonField(value)) as any;
      }
      
      console.log(`Auto-saving field ${String(field)}:`, fieldValue);

      // Create an update object with just the single field
      const updateData = { [field]: fieldValue };

      // Don't include updated_at to let Supabase update it automatically
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .select(); // Add select to retrieve the updated data including the timestamp

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      console.log('Auto-save successful, new timestamp:', updatedData?.[0]?.updated_at);
      
      // Log only the specific field change that occurred
      if (currentPropertyData) {
        const oldValueObj = { [field]: currentPropertyData[field as string] };
        const newValueObj = { [field]: fieldValue };
        await logPropertyChanges(propertyId, oldValueObj, newValueObj);
      }
      
      // If we got back data, use the actual server timestamp for lastSaved
      if (updatedData && updatedData[0]) {
        setLastSaved(new Date(updatedData[0].updated_at));
      } else {
        setLastSaved(new Date());
      }
      
      setPendingChanges(false);
      
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

  // Updated to optionally accept a specific fields subset to save
  const autosaveData = async (
    formData: PropertyFormData, 
    specificFields?: Record<string, any>
  ): Promise<boolean> => {
    if (!formData.id) return false;
    
    try {
      setIsSaving(true);
      
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', formData.id)
        .single();
      
      // If specific fields provided, only save those
      const submitData = specificFields || {
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
      
      console.log('Auto-saving property data...', specificFields ? 'Specific fields only' : 'All fields');

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
      
      // If we got back data, use the actual server timestamp for lastSaved
      if (updatedData && updatedData[0]) {
        setLastSaved(new Date(updatedData[0].updated_at));
      } else {
        setLastSaved(new Date());
      }
      
      setPendingChanges(false);
      
      // Handle floorplans if needed
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
    autosaveField,
    isSaving,
    lastSaved,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}
