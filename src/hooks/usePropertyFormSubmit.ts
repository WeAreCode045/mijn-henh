
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertySubmitData } from "@/types/property";

export function usePropertyFormSubmit() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData) => {
    e.preventDefault();
    
    // Prepare data for submission - ensure areas includes imageIds
    const areasWithImages = formData.areas.map(area => ({
      id: area.id,
      title: area.title,
      description: area.description,
      imageIds: area.imageIds || [],
      columns: area.columns || 2
    }));

    console.log("Form submission - areas with images:", areasWithImages);
    
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
      features: formData.features,
      floorplans: formData.floorplans,
      featuredImage: formData.featuredImage,
      gridImages: formData.gridImages,
      map_image: formData.map_image,
      latitude: formData.latitude,
      longitude: formData.longitude,
      areas: areasWithImages,
      nearby_places: formData.nearby_places,
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
