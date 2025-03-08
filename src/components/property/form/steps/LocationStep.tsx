
import { PropertyFormData } from "@/types/property";
import { AddressSection } from "./location/AddressSection";
import { MapPreviewSection } from "./location/MapPreviewSection";
import { NearbyPlacesSection } from "./location/NearbyPlacesSection";
import { NearbyCitiesSection } from "./location/NearbyCitiesSection";
import { useState } from "react";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  handleMapImageDelete?: () => Promise<void>;
  onAddTechnicalItem?: () => void;
  isLoadingLocationData?: boolean;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onRemoveNearbyPlace,
  handleMapImageDelete,
  isLoadingLocationData = false
}: LocationStepProps) {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  // Function to handle generating description
  const handleGenerateDescription = async () => {
    if (!onFetchLocationData) return;
    
    setIsGeneratingDescription(true);
    try {
      await onFetchLocationData();
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="space-y-6">
      <AddressSection 
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchLocationDescription={handleGenerateDescription}
        isLoadingLocationDescription={isGeneratingDescription}
      />
      
      <MapPreviewSection 
        formData={formData}
        handleMapImageDelete={handleMapImageDelete}
      />
      
      <NearbyPlacesSection 
        formData={formData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
        onFetchLocationData={onFetchLocationData}
        isLoadingLocationData={isLoadingLocationData}
        onFieldChange={onFieldChange}
      />
      
      <NearbyCitiesSection 
        formData={formData}
        onFetchLocationData={onFetchLocationData}
        isLoadingLocationData={isLoadingLocationData}
        onFieldChange={onFieldChange}
      />
    </div>
  );
}
