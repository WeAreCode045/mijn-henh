
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
      
      // Prepare data for update
      const updateData = {
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
        shortDescription: formData.shortDescription || "",
        description: formData.description,
        location_description: formData.location_description,
        features: featuresJson,
        areas: areasForDb as Json[],
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
        floorplanEmbedScript: formData.floorplanEmbedScript || ""
      };
      
      console.log("Data being sent to database:", JSON.stringify(updateData).substring(0, 200) + "...");
      
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
