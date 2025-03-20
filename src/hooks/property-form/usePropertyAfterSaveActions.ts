
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { usePropertyImageSaver } from "./usePropertyImageSaver";
import { getNewPropertyId } from "./utils/propertyIdUtils";
import { saveAllImagesForNewProperty } from "./utils/propertySaveImageUtils";

export function usePropertyAfterSaveActions() {
  const { savePropertyImages } = usePropertyImageSaver();
  
  const fetchUpdatedPropertyData = async (propertyId: string) => {
    const { data: freshPropertyData } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
      
    return freshPropertyData;
  };
  
  const handleExistingPropertySave = async (formData: PropertyFormData) => {
    if (!formData.id) return null;
    
    // Save or update featured images
    await savePropertyImages(formData);
    
    // Retrieve the updated property to get the new updated_at timestamp
    const updatedData = await fetchUpdatedPropertyData(formData.id);
    console.log("usePropertyFormSubmit - Fetched updated property data with timestamp:", updatedData?.updated_at);
    
    return updatedData;
  };
  
  const handleNewPropertySave = async (formData: PropertyFormData) => {
    // Get the ID of the newly created property
    const newPropertyId = await getNewPropertyId(formData.title);
    if (!newPropertyId) return null;
    
    // Save images for new property
    await saveAllImagesForNewProperty(newPropertyId, formData);
    
    // Retrieve the new property data
    const freshPropertyData = await fetchUpdatedPropertyData(newPropertyId);
    console.log("usePropertyFormSubmit - New property created with timestamp:", freshPropertyData?.updated_at);
    
    return freshPropertyData;
  };
  
  return {
    handleExistingPropertySave,
    handleNewPropertySave,
    fetchUpdatedPropertyData
  };
}
