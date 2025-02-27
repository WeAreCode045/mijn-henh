
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
    
    // Prepare data for submission - ensure areas includes columns property
    const areasWithImages = formData.areas.map(area => ({
      id: area.id,
      title: area.title,
      description: area.description,
      imageIds: area.imageIds || [],
      columns: area.columns || 2 // Ensure columns property is included
    }));

    console.log("Form submission - areas with images and columns:", areasWithImages);
    
    // Cast the features and nearby_places to Json type to satisfy TypeScript
    const featuresJson = formData.features as unknown as Json;
    const nearby_placesJson = formData.nearby_places as unknown as Json;
    
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
      floorplans: formData.floorplans,
      featuredImage: formData.featuredImage,
      gridImages: formData.gridImages,
      map_image: formData.map_image,
      latitude: formData.latitude,
      longitude: formData.longitude,
      areas: areasWithImages as unknown as Json[],
      nearby_places: nearby_placesJson,
      images: formData.images.map(img => img.url)
    };
    
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('properties')
          .update(submitData)
          .eq('id', formData.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert(submitData);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Property created successfully",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the property",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
