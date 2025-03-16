
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgencySettings } from "@/hooks/useAgencySettings";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange: (section: string, field: string, value: any) => void;
}

export function BasicDetails({ formData, onFieldChange, onGeneralInfoChange }: BasicDetailsProps) {
  const { settings } = useAgencySettings();
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  // Get values from generalInfo or fallback to direct properties for backwards compatibility
  const propertyDetails = formData.generalInfo?.propertyDetails || {
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    objectId: formData.object_id || ''
  };

  const handleChange = (field: string, value: string) => {
    console.log(`BasicDetails - ${field} changed to:`, value);
    onGeneralInfoChange('propertyDetails', field, value);
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
      if (!(window as any).google || 
          !(window as any).google?.maps || 
          !(window as any).google?.maps?.places) {
        console.error('Google Maps Places API not loaded');
        return;
      }

      const autocomplete = new (window as any).google!.maps!.places!.Autocomplete(
        addressInputRef.current as HTMLInputElement,
        { types: ['address'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          handleChange('address', place.formatted_address);
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
              value={propertyDetails.title}
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
              value={propertyDetails.price}
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
              value={propertyDetails.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Address"
              className="mt-1 p-2"
              ref={addressInputRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objectId">Object ID</Label>
            <Input
              id="objectId"
              type="text"
              value={propertyDetails.objectId}
              onChange={(e) => handleChange('objectId', e.target.value)}
              placeholder="Object ID"
              className="mt-1 p-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
