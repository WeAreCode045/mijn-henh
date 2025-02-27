
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from "@/types/property";
import type { Json } from "@/integrations/supabase/types";

export function usePropertyAutosave() {
  const { toast } = useToast();

  const autosaveData = async (formData: PropertyFormData) => {
    if (!formData.id) return;

    try {
      const { data: currentData, error: fetchError } = await supabase
        .from('properties')
        .select('map_image, nearby_places, latitude, longitude')
        .eq('id', formData.id)
        .single();

      if (fetchError) throw fetchError;

      const imageUrls = formData.images.map(img => img.url);
      
      // Convert floorplans from PropertyFloorplan[] to proper format for database
      // The database expects floorplans as string[] but we need to store additional metadata
      // We'll stringify the objects to ensure they're stored as strings in the array
      const floorplansForDb = formData.floorplans.map(floorplan => 
        JSON.stringify({
          url: floorplan.url,
          columns: floorplan.columns || 1
        })
      );

      // Get the database schema structure
      const { error } = await supabase
        .from('properties')
        .upsert({
          address: formData.address || null,
          areaPhotos: formData.areaPhotos || [],
          areas: formData.areas as unknown as Json[],
          bathrooms: formData.bathrooms || null,
          bedrooms: formData.bedrooms || null,
          buildYear: formData.buildYear || null,
          description: formData.description || null,
          energyLabel: formData.energyLabel || null,
          featuredImage: formData.featuredImage || null,
          features: formData.features as unknown as Json,
          floorplans: floorplansForDb, // Sending as string[] which is what Supabase expects
          garages: formData.garages || null,
          gridImages: formData.gridImages || [],
          hasGarden: formData.hasGarden || false,
          images: imageUrls,
          latitude: formData.latitude ?? currentData?.latitude ?? null,
          livingArea: formData.livingArea || null,
          longitude: formData.longitude ?? currentData?.longitude ?? null,
          map_image: formData.map_image ?? currentData?.map_image ?? null,
          nearby_places: formData.nearby_places as unknown as Json,
          price: formData.price || null,
          sqft: formData.sqft || null,
          title: formData.title || null,
          id: formData.id
        });

      if (error) throw error;

      toast({
        description: "Progress saved",
        duration: 2000
      });
    } catch (error) {
      console.error('Autosave error:', error);
      toast({
        variant: "destructive",
        description: "Failed to save progress",
      });
    }
  };

  return { autosaveData };
}
