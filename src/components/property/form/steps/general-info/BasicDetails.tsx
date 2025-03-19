
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { GoogleAddressAutocomplete } from "@/components/GoogleAddressAutocomplete";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange?: (section: string, field: string, value: any) => void;
}

export function BasicDetails({
  formData,
  onFieldChange,
  onGeneralInfoChange
}: BasicDetailsProps) {
  const { settings } = useAgencySettings();
  const [useGoogleAutocomplete, setUseGoogleAutocomplete] = useState(false);

  useEffect(() => {
    // Check if Google Maps API key is available
    if (settings?.googleMapsApiKey) {
      setUseGoogleAutocomplete(true);
    }
  }, [settings]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onGeneralInfoChange) {
      onGeneralInfoChange('propertyDetails', 'title', value);
    }
    onFieldChange("title", value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onGeneralInfoChange) {
      onGeneralInfoChange('propertyDetails', 'price', value);
    }
    onFieldChange("price", value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onGeneralInfoChange) {
      onGeneralInfoChange('propertyDetails', 'address', value);
    }
    onFieldChange("address", value);
  };

  const handleAddressSelect = (address: string) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('propertyDetails', 'address', address);
    }
    onFieldChange("address", address);
  };

  const handleObjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onGeneralInfoChange) {
      onGeneralInfoChange('propertyDetails', 'objectId', value);
    }
    onFieldChange("object_id", value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="propertyTitle" className="text-sm font-medium">Property Title</label>
            <Input
              id="propertyTitle"
              value={formData.title || ""}
              onChange={handleTitleChange}
              placeholder="Enter property title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="propertyPrice" className="text-sm font-medium">Price</label>
            <Input
              id="propertyPrice"
              value={formData.price || ""}
              onChange={handlePriceChange}
              placeholder="Enter price"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="propertyAddress" className="text-sm font-medium">Address</label>
            {useGoogleAutocomplete ? (
              <GoogleAddressAutocomplete
                id="propertyAddress"
                value={formData.address || ""}
                onChange={handleAddressChange}
                onSelect={handleAddressSelect}
                apiKey={settings?.googleMapsApiKey || ""}
              />
            ) : (
              <Input
                id="propertyAddress"
                value={formData.address || ""}
                onChange={handleAddressChange}
                placeholder="Enter property address"
              />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="objectId" className="text-sm font-medium">Object ID</label>
            <Input
              id="objectId"
              value={formData.object_id || ""}
              onChange={handleObjectIdChange}
              placeholder="Enter object ID"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
