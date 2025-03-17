
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { prepareAreasForFormSubmission } from "@/hooks/property-form/preparePropertyData";

export function usePropertyContentSubmit(
  formData: PropertyFormData,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const { toast } = useToast();

  const onSubmit = async () => {
    console.log("onSubmit called in usePropertyContentSubmit with formData ID:", formData.id);
    
    // If we don't have an ID, we can't save to the database
    if (!formData.id) {
      console.error("Cannot save: formData.id is missing", formData);
      toast({
        title: "Error",
        description: "Cannot save property: missing ID",
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Saving directly to database");
    
    try {
      console.log("Saving property with ID:", formData.id);
      
      // Transform areas to the correct format for the database
      const areasForDb = prepareAreasForFormSubmission(formData.areas || []);
      console.log("Areas prepared for database:", areasForDb);
      
      // Transform features, nearby_places, and nearby_cities to JSON strings
      const featuresJson = typeof formData.features === 'string' 
        ? formData.features 
        : JSON.stringify(formData.features || []);
      
      const nearby_placesJson = typeof formData.nearby_places === 'string'
        ? formData.nearby_places
        : JSON.stringify(formData.nearby_places || []);
      
      const nearby_citiesJson = typeof formData.nearby_cities === 'string'
        ? formData.nearby_cities
        : JSON.stringify(formData.nearby_cities || []);
      
      // Stringify generalInfo for database storage - this is the key part!
      console.log("generalInfo before stringify:", formData.generalInfo);
      const generalInfoJson = typeof formData.generalInfo === 'string'
        ? formData.generalInfo
        : JSON.stringify(formData.generalInfo || {});
      console.log("generalInfo after stringify:", generalInfoJson);
      
      // Get values from generalInfo structure if available, otherwise use legacy fields
      const { 
        title, price, address, object_id,
        description, shortDescription,
        bedrooms, bathrooms, sqft, livingArea, buildYear, energyLabel
      } = extractPropertyValues(formData);
      
      // Prepare data for update
      const updateData = {
        title,
        price,
        address,
        bedrooms,
        bathrooms,
        sqft,
        livingArea,
        buildYear,
        garages: formData.garages,
        energyLabel,
        hasGarden: formData.hasGarden,
        shortDescription: shortDescription || "",
        description,
        location_description: formData.location_description,
        features: featuresJson,
        areas: areasForDb as Json[],
        nearby_places: nearby_placesJson,
        nearby_cities: nearby_citiesJson,
        latitude: formData.latitude,
        longitude: formData.longitude,
        map_image: formData.map_image,
        object_id,
        agent_id: formData.agent_id,
        template_id: formData.template_id,
        virtualTourUrl: formData.virtualTourUrl,
        youtubeUrl: formData.youtubeUrl,
        floorplanEmbedScript: formData.floorplanEmbedScript || "",
        // Explicitly add the generalInfo field to the update data
        generalInfo: generalInfoJson
      };
      
      console.log("Data being sent to database:", JSON.stringify(updateData).substring(0, 200) + "...");
      console.log("generalInfo included in update:", updateData.generalInfo ? "Yes" : "No");
      
      // Update the property in the database
      const { error, data } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', formData.id)
        .select();
      
      if (error) {
        console.error("Error saving to database:", error);
        throw error;
      }
      
      console.log("Save successful, response data:", data);
      setLastSaved(new Date());
      setPendingChanges(false);
      toast({
        title: "Success",
        description: "All changes have been saved",
      });
      
      return true;
    } catch (error) {
      console.error("Final save failed:", error);
      toast({
        title: "Error",
        description: "Failed to save all changes",
        variant: "destructive",
      });
      return false;
    }
  };

  return { onSubmit };
}

// Helper function to extract values from either generalInfo structure or legacy fields
function extractPropertyValues(formData: PropertyFormData) {
  // If generalInfo exists, use its values, otherwise fall back to direct properties
  if (formData.generalInfo) {
    try {
      const generalInfo = typeof formData.generalInfo === 'string'
        ? JSON.parse(formData.generalInfo)
        : formData.generalInfo;
        
      return {
        title: generalInfo.propertyDetails?.title || formData.title || '',
        price: generalInfo.propertyDetails?.price || formData.price || '',
        address: generalInfo.propertyDetails?.address || formData.address || '',
        object_id: generalInfo.propertyDetails?.objectId || formData.object_id || '',
        description: generalInfo.description?.fullDescription || formData.description || '',
        shortDescription: generalInfo.description?.shortDescription || formData.shortDescription || '',
        bedrooms: generalInfo.keyInformation?.bedrooms || formData.bedrooms || '',
        bathrooms: generalInfo.keyInformation?.bathrooms || formData.bathrooms || '',
        sqft: generalInfo.keyInformation?.lotSize || formData.sqft || '',
        livingArea: generalInfo.keyInformation?.livingArea || formData.livingArea || '',
        buildYear: generalInfo.keyInformation?.buildYear || formData.buildYear || '',
        energyLabel: generalInfo.keyInformation?.energyClass || formData.energyLabel || ''
      };
    } catch (error) {
      console.error("Error parsing generalInfo:", error);
    }
  }
  
  // Fall back to legacy fields
  return {
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    object_id: formData.object_id || '',
    description: formData.description || '',
    shortDescription: formData.shortDescription || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    sqft: formData.sqft || '',
    livingArea: formData.livingArea || '',
    buildYear: formData.buildYear || '',
    energyLabel: formData.energyLabel || ''
  };
}
