
import { useAutoSaveField } from "./useAutoSaveField";
import { useAutoSaveData } from "./useAutoSaveData";
import { useAutoSaveState } from "./useAutoSaveState";
import { useEditLoggerIntegration } from "./useEditLoggerIntegration";
import { PropertyFormData } from "@/types/property";

export function usePropertyAutoSave() {
  const { autosaveField: saveField, isSaving: isFieldSaving } = useAutoSaveField();
  const { autosaveData: saveData, isSaving: isDataSaving } = useAutoSaveData();
  const { 
    isSaving: internalIsSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    pendingChanges,
    setPendingChanges,
    timeoutRef
  } = useAutoSaveState();
  const { logFieldChange, logDataChanges } = useEditLoggerIntegration();

  // Combined autosave field function with logging
  const autosaveField = async <K extends keyof PropertyFormData>(
    propertyId: string,
    field: K,
    value: PropertyFormData[K]
  ): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
        
      // Perform the save operation
      const success = await saveField(propertyId, field, value);
      
      if (success) {
        // Log the change
        if (currentPropertyData) {
          const oldValueObj = { [field]: currentPropertyData[field as string] };
          const newValueObj = { [field]: value };
          await logFieldChange(propertyId, oldValueObj, newValueObj);
        }
        
        // Update state
        setLastSaved(new Date());
        setPendingChanges(false);
      }
      
      return success;
    } catch (error) {
      console.error('Auto-save field error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Combined autosave data function with logging
  const autosaveData = async (formData: PropertyFormData): Promise<boolean> => {
    if (!formData.id) return false;
    
    setIsSaving(true);
    
    try {
      // Get current property data for change tracking
      const { data: currentPropertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', formData.id)
        .single();
        
      // Perform the save operation
      const success = await saveData(formData);
      
      if (success) {
        // Log the changes
        if (currentPropertyData) {
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
          
          await logDataChanges(formData.id, currentPropertyData, submitData);
        }
        
        // Update state
        setLastSaved(new Date());
        setPendingChanges(false);
      }
      
      return success;
    } catch (error) {
      console.error('Auto-save data error:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    autosaveData,
    autosaveField,
    isSaving: internalIsSaving || isFieldSaving || isDataSaving,
    lastSaved,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}

// Import missing dependency
import { supabase } from "@/integrations/supabase/client";
