
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/property';

export function useMapGeneration(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setIsGeneratingMap: (loading: boolean) => void,
  toast: any
) {
  const generateMapImage = useCallback(async () => {
    if (!formData.latitude || !formData.longitude) {
      toast({
        title: "Error",
        description: "Please fetch location data first to get coordinates",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingMap(true);
    
    try {
      const { data: settings } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();
      
      if (!settings?.google_maps_api_key) {
        throw new Error("Google Maps API key not configured");
      }
      
      const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${formData.latitude},${formData.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${formData.latitude},${formData.longitude}&key=${settings.google_maps_api_key}`;
      
      onFieldChange('map_image', mapImageUrl);
      
      if (formData.id) {
        await supabase
          .from('properties')
          .update({ map_image: mapImageUrl })
          .eq('id', formData.id);
      }
      
      toast({
        title: "Success",
        description: "Map image generated successfully",
      });
    } catch (error) {
      console.error("Error generating map image:", error);
      toast({
        title: "Error",
        description: "Failed to generate map image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMap(false);
    }
  }, [formData.latitude, formData.longitude, formData.id, onFieldChange, setIsGeneratingMap, toast]);
  
  return { generateMapImage };
}
