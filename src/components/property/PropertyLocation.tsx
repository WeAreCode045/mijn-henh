
import { useLocationData } from "./location/useLocationData";
import { MapPreview } from "./location/MapPreview";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyPlaceType } from "@/types/property";
import type { Json } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { AddressInput } from "./location/AddressInput";
import { NearbyPlaces } from "./location/NearbyPlaces";
import { LocationEditor } from "./location/LocationEditor";
import { useEffect, useRef } from "react";

interface PropertyLocationProps {
  id?: string;
  address: string;
  description?: string;
  location_description?: string;
  map_image?: string | null;
  nearby_places?: PropertyPlaceType[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationFetch: () => Promise<void>;
  onMapImageDelete?: () => void;
}

export function PropertyLocation({
  id,
  address,
  description,
  location_description,
  map_image,
  nearby_places = [],
  onChange,
  onLocationFetch,
  onMapImageDelete,
}: PropertyLocationProps) {
  const { isLoading, fetchLocationData } = useLocationData();
  const { toast } = useToast();
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

  const handleLocationFetch = async () => {
    const data = await fetchLocationData(address, id);
    if (data) {
      await onLocationFetch();
    }
  };

  const handleGenerateDescription = async () => {
    if (!id || !address) return;
    try {
      const { data, error } = await supabase.functions.invoke('generate-location-description', {
        body: { 
          address, 
          nearbyPlaces: nearby_places,
          language: 'nl'
        }
      });

      if (error) throw error;

      if (data?.description) {
        const { error: updateError } = await supabase
          .from('properties')
          .update({ location_description: data.description })
          .eq('id', id);

        if (updateError) throw updateError;

        const event = {
          target: {
            name: 'location_description',
            value: data.description
          }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        
        onChange(event);

        toast({
          description: "Locatiebeschrijving succesvol gegenereerd",
        });
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: "destructive",
        description: "Kon geen locatiebeschrijving genereren",
      });
    }
  };

  return (
    <div className="space-y-6">
      <AddressInput
        address={address}
        isLoading={isLoading}
        disabled={!id}
        hasNearbyPlaces={nearby_places.length > 0}
        onChange={onChange}
        onLocationFetch={handleLocationFetch}
        onGenerateDescription={handleGenerateDescription}
      />

      {map_image && (
        <MapPreview 
          map_image={map_image} 
          onDelete={onMapImageDelete ?? (() => {})} 
        />
      )}

      <LocationEditor
        id={id}
        location_description={location_description}
        onChange={onChange}
      />

      <NearbyPlaces 
        places={nearby_places} 
        onPlaceDelete={async (e, placeId) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (!id) return;

          try {
            const updatedPlaces = nearby_places
              .filter(place => place.id !== placeId)
              .map(place => ({
                id: place.id,
                name: place.name,
                type: place.type,
                vicinity: place.vicinity,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total
              })) as Json;

            const { error } = await supabase
              .from('properties')
              .update({ nearby_places: updatedPlaces })
              .eq('id', id);

            if (error) throw error;

            await onLocationFetch();
            toast({
              description: "Voorziening verwijderd succesvol",
            });
          } catch (error) {
            console.error('Error removing place:', error);
            toast({
              variant: "destructive",
              description: "Kon voorziening niet verwijderen",
            });
          }
        }} 
      />
    </div>
  );
}
