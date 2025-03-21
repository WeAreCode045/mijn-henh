
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useToast } from "@/components/ui/use-toast";
import { useLocationCoordinates } from "@/hooks/location/useLocationCoordinates";
import { useState } from "react";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function BasicDetails({ formData, onFieldChange }: BasicDetailsProps) {
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const { fetchLocationData } = useLocationCoordinates(formData, onFieldChange, setIsLoadingCoordinates, toast);

  const handleChange = (field: keyof PropertyFormData, value: string) => {
    console.log(`BasicDetails - ${field} changed to:`, value);
    onFieldChange(field, value);

    // When the address is updated, automatically fetch coordinates only
    if (field === 'address' && value && formData.id) {
      // Add slight delay to allow for typing to complete
      const timer = setTimeout(() => {
        console.log("Auto-fetching coordinates for address:", value);
        fetchLocationData();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  };

  // Set up Google Places Autocomplete for address field
  useEffect(() => {
    const googleApiKey = settings?.googleMapsApiKey;
    if (!googleApiKey || !addressInputRef.current) return;

    // Load the Google Maps JavaScript API
    const loadGoogleMapsScript = () => {
      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) return;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      // Use window with type assertion to access the google object
      if (!(window as GoogleMapsWindow).google || 
          !(window as GoogleMapsWindow).google?.maps || 
          !(window as GoogleMapsWindow).google?.maps?.places) {
        console.error('Google Maps Places API not loaded');
        return;
      }

      const autocomplete = new (window as GoogleMapsWindow).google!.maps!.places!.Autocomplete(
        addressInputRef.current as HTMLInputElement,
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          handleChange('address', place.formatted_address);
          
          // Autocomplete also gives us the coordinates directly
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            console.log("Got coordinates from Places API:", lat, lng);
            onFieldChange('latitude', lat);
            onFieldChange('longitude', lng);
          }
        }
      });
    };

    loadGoogleMapsScript();
  }, [settings, onFieldChange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Title"
              className="mt-1 p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="Price"
              className="mt-1 p-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Address"
              className="mt-1 p-2"
              ref={addressInputRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="object_id">Object ID</Label>
            <Input
              id="object_id"
              type="text"
              value={formData.object_id || ''}
              onChange={(e) => handleChange('object_id', e.target.value)}
              placeholder="Object ID"
              className="mt-1 p-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
