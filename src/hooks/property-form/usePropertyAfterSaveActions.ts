
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyImageSaver } from "./usePropertyImageSaver";
import { saveAllImagesForNewProperty } from "./utils/propertySaveImageUtils";

export function usePropertyAfterSaveActions() {
  const { savePropertyImages } = usePropertyImageSaver();
  
  const fetchUpdatedPropertyData = async (propertyId: string) => {
    if (!propertyId) {
      console.log("fetchUpdatedPropertyData - No property ID provided");
      return null;
    }
    
    const { data: freshPropertyData } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
      
    return freshPropertyData;
  };
  
  const handleExistingPropertySave = async (formData: PropertyFormData) => {
    if (!formData.id) {
      console.log("handleExistingPropertySave - No property ID");
      return null;
    }
    
    // Save or update featured images
    await savePropertyImages(formData);
    
    // Retrieve the updated property to get the new updated_at timestamp
    const updatedData = await fetchUpdatedPropertyData(formData.id);
    console.log("usePropertyFormSubmit - Fetched updated property data with timestamp:", updatedData?.updated_at);
    
    return updatedData;
  };
  
  const handleNewPropertySave = async (formData: PropertyFormData) => {
    // For already created properties (we have an ID)
    if (formData.id) {
      console.log("handleNewPropertySave - Property already has ID:", formData.id);
      return handleExistingPropertySave(formData);
    }
    
    console.log("handleNewPropertySave - This should not happen as properties are now created upfront");
    return null;
  };
  
  return {
    handleExistingPropertySave,
    handleNewPropertySave,
    fetchUpdatedPropertyData
  };
}
