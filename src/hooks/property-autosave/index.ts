
import { useState, useRef } from "react";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { prepareAreasForFormSubmission } from "../property-form/preparePropertyData";

export function usePropertyAutoSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Save a single field to the database
  const autosaveField = async <K extends keyof PropertyFormData>(
    propertyId: string,
    field: K,
    value: PropertyFormData[K]
  ): Promise<boolean> => {
    if (!propertyId) return false;
    
    setIsSaving(true);
    
    try {
      console.log(`Starting autosave for field ${String(field)} on property ${propertyId}`);
      
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
        
      // Only perform save if value has actually changed
      if (currentPropertyData && JSON.stringify(currentPropertyData[field as string]) === JSON.stringify(value)) {
        console.log(`Field ${String(field)} unchanged, skipping save`);
        setIsSaving(false);
        return true;
      }
      
      // Prepare the field value for database submission
      let fieldValue = value;
      
      // Special handling for specific field types
      if (field === 'features' && Array.isArray(value)) {
        fieldValue = JSON.stringify(value) as any;
      } else if (field === 'areas' && Array.isArray(value)) {
        fieldValue = prepareAreasForFormSubmission(value as any) as any;
      } else if (field === 'nearby_places' && Array.isArray(value)) {
        fieldValue = JSON.stringify(value) as any;
      } else if (field === 'nearby_cities' && Array.isArray(value)) {
        fieldValue = JSON.stringify(value) as any;
      }
      
      console.log(`Auto-saving field ${String(field)}:`, fieldValue);

      // Create an update object with just the single field
      const updateData = { [field]: fieldValue };

      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .select();

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      console.log('Auto-save successful, new timestamp:', updatedData?.[0]?.updated_at);
      console.log('Updated data from database:', updatedData);
      
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

  // Save only specific fields from the form data
  const autosaveData = async (
    formData: PropertyFormData, 
    specificFields?: Record<string, any>
  ): Promise<boolean> => {
    if (!formData.id) {
      console.error("Cannot autosave - property ID is missing");
      return false;
    }
    
    setIsSaving(true);
    console.log(`Starting autosaveData for property ${formData.id}`);
    
    try {
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
      console.log('Submit data:', submitData);

      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(submitData)
        .eq('id', formData.id)
        .select();

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      console.log('Auto-save successful, new timestamp:', updatedData?.[0]?.updated_at);
      console.log('Updated data from database:', updatedData);
      
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
