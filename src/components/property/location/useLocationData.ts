
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLocationData() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocationData = async (address: string, id?: string) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please enter an address first",
        variant: "destructive",
      });
      return null;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Please save the property first before fetching location data",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);

    try {
      const { data: settings } = await supabase
        .from('agency_settings')
        .select('google_maps_api_key')
        .single();

      if (!settings?.google_maps_api_key) {
        toast({
          title: "Error",
          description: "Google Maps API key not configured",
          variant: "destructive",
        });
        return null;
      }

      console.log('Fetching location data for property:', id);
      
      const { data, error } = await supabase.functions.invoke('fetch-location-data', {
        body: { 
          address, 
          apiKey: settings.google_maps_api_key,
          propertyId: id 
        }
      });

      if (error) throw error;

      console.log('Location data fetched:', data);

      toast({
        title: "Success",
        description: "Location data fetched successfully",
      });

      return data;
    } catch (error) {
      console.error('Error fetching location:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location data",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchLocationData,
  };
}
