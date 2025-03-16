
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralLocationInfo } from "./location/GeneralLocationInfo";
import { MapLocationSection } from "./location/MapLocationSection";
import { NearbyPlacesSection } from "./location/NearbyPlacesSection";
import { NearbyCitiesSection } from "./location/NearbyCitiesSection";
import { LocationDescriptionSection } from "./location/LocationDescriptionSection";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData: () => Promise<any>;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<any>;
  onGenerateLocationDescription: () => Promise<any>;
  onGenerateMap: () => Promise<any>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  setPendingChanges,
}: LocationStepProps) {
  const [isLoadingNearbyPlaces, setIsLoadingNearbyPlaces] = useState(false);

  // Handle nearby places fetch with loading state
  const handleFetchNearbyPlaces = async (category: string) => {
    setIsLoadingNearbyPlaces(true);
    try {
      await onFetchCategoryPlaces(category);
      if (setPendingChanges) setPendingChanges(true);
    } finally {
      setIsLoadingNearbyPlaces(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Location Information</h2>
      
      <GeneralLocationInfo
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchLocationData={onFetchLocationData}
        isLoadingLocationData={isLoadingLocationData}
      />
      
      <MapLocationSection
        formData={formData}
        onFieldChange={onFieldChange}
        onGenerateMap={onGenerateMap}
        isGeneratingMap={isGeneratingMap}
      />
      
      <NearbyPlacesSection
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchNearbyPlaces={handleFetchNearbyPlaces}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        isLoadingNearbyPlaces={isLoadingNearbyPlaces}
      />
      
      <NearbyCitiesSection
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchNearbyCities={onFetchNearbyCities}
        isLoadingLocationData={isLoadingLocationData}
      />
      
      <LocationDescriptionSection
        formData={formData}
        onFieldChange={onFieldChange}
        onGenerateDescription={onGenerateLocationDescription}
        isGenerating={isLoadingLocationData}
      />
    </div>
  );
}
