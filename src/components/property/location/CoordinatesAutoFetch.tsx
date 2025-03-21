
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CoordinatesAutoFetchProps {
  id?: string;
  address: string;
}

export function CoordinatesAutoFetch({ id, address }: CoordinatesAutoFetchProps) {
  const lastAddressRef = useRef(address);

  // Auto-fetch coordinates when address changes
  useEffect(() => {
    // Only proceed if we have an ID and an address, and the address has changed
    if (id && address && address !== lastAddressRef.current) {
      lastAddressRef.current = address;
      
      // Simple auto-fetch just for coordinates
      const fetchCoordinates = async () => {
        try {
          const { data: settings } = await supabase
            .from('agency_settings')
            .select('google_maps_api_key')
            .single();

          if (!settings?.google_maps_api_key) {
            console.error("Google Maps API key not configured");
            return;
          }

          const { data, error } = await supabase.functions.invoke('fetch-location-data', {
            body: { 
              address, 
              apiKey: settings.google_maps_api_key,
              propertyId: id,
              coordinatesOnly: true 
            }
          });

          if (error) throw error;

          console.log('Coordinates auto-fetched for address update');
        } catch (error) {
          console.error('Error auto-fetching coordinates:', error);
        }
      };

      // We're using a timeout to debounce the API call
      const timer = setTimeout(() => {
        fetchCoordinates();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [address, id]);

  return null; // This is a behavior-only component with no UI
}
