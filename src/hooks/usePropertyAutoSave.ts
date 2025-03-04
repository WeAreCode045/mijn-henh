
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from "@/types/property";
import type { Json } from "@/integrations/supabase/types";

// Renamed to usePropertyAutoSave for consistency across the application
export function usePropertyAutoSave() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  const autosaveData = async (formData: PropertyFormData) => {
    if (!formData.id) return;

    setIsSaving(true);
    try {
      const { data: currentData, error: fetchError } = await supabase
        .from('properties')
        .select('map_image, nearby_places, latitude, longitude, virtualTourUrl, youtubeUrl, notes')
        .eq('id', formData.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const imageUrls = formData.images.map(img => img.url);
      
      // Process floorplans data - ensure it's stored as string[] in the database
      // Each string in the array is a stringified JSON object with url and columns properties
      const floorplansForDb = formData.floorplans.map(floorplan => {
        // Create a clean object with just the properties we want to store
        const floorplanData = {
          url: floorplan.url,
          columns: floorplan.columns || 1
        };
        
        // Return the stringified object
        return JSON.stringify(floorplanData);
      });

      console.log("usePropertyAutoSave - Processed floorplans for database:", floorplansForDb);

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
          floorplans: floorplansForDb,
          garages: formData.garages || null,
          coverImages: formData.coverImages || [],
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
          id: formData.id,
          agent_id: formData.agent_id || null,
          virtualTourUrl: formData.virtualTourUrl ?? currentData?.virtualTourUrl ?? null,
          youtubeUrl: formData.youtubeUrl ?? currentData?.youtubeUrl ?? null,
          notes: formData.notes ?? currentData?.notes ?? null,
          object_id: formData.object_id || null
        });

      if (error) throw error;

      setLastSaved(new Date());
      setPendingChanges(false);
      
      toast({
        description: "Progress saved",
        duration: 2000
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        description: "Failed to save progress",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { 
    autosaveData,
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    pendingChanges,
    setPendingChanges
  };
}
