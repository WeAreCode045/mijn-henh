
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertySubmitData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function usePropertyFormSubmit() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData) => {
    e.preventDefault();
    console.log("usePropertyFormSubmit - handleSubmit called with formData:", formData);
    
    if (!formData) {
      console.error("Form data is undefined or null");
      toast({
        title: "Error",
        description: "No form data available to submit",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare areas data with correct types for submission
    const areasWithImages = formData.areas.map(area => {
      console.log(`usePropertyFormSubmit - Preparing area ${area.id} for submission with columns:`, area.columns);
      return {
        id: area.id,
        title: area.title,
        description: area.description,
        imageIds: area.imageIds || [],
        columns: typeof area.columns === 'number' ? area.columns : 2 // Ensure columns property is correctly typed
      };
    });

    console.log("usePropertyFormSubmit - Form submission - areas with columns:", areasWithImages);
    
    // Prepare floorplans data with columns
    const floorplansData = formData.floorplans.map(floorplan => {
      console.log("usePropertyFormSubmit - Preparing floorplan for submission:", floorplan);
      return {
        url: floorplan.url,
        columns: typeof floorplan.columns === 'number' ? floorplan.columns : 1
      };
    });
    
    console.log("usePropertyFormSubmit - Form submission - floorplans with columns:", floorplansData);
    
    // Cast the features and nearby_places to Json type to satisfy TypeScript
    const featuresJson = formData.features as unknown as Json;
    const nearby_placesJson = formData.nearby_places as unknown as Json;
    const areasJson = areasWithImages as unknown as Json[];
    const floorplansJson = floorplansData as unknown as Json;
    
    const submitData: PropertySubmitData = {
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
      location_description: formData.location_description,
      features: featuresJson,
      floorplans: floorplansJson,
      featuredImage: formData.featuredImage,
      gridImages: formData.gridImages,
      map_image: formData.map_image,
      latitude: formData.latitude,
      longitude: formData.longitude,
      areas: areasJson,
      nearby_places: nearby_placesJson,
      images: formData.images.map(img => img.url),
      object_id: formData.object_id
    };
    
    try {
      if (formData.id) {
        console.log("usePropertyFormSubmit - Updating property with ID:", formData.id);
        console.log("usePropertyFormSubmit - Update data:", JSON.stringify(submitData));
        
        const { error } = await supabase
          .from('properties')
          .update(submitData as any)
          .eq('id', formData.id);
          
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        console.log("usePropertyFormSubmit - Creating property with areas data:", JSON.stringify(submitData.areas));
        const { error } = await supabase
          .from('properties')
          .insert(submitData as any);
          
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Property created successfully",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('usePropertyFormSubmit - Error saving property:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the property",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
