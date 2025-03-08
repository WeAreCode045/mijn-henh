
import { PropertyFormData } from "@/types/property";
import { AddressSection } from "./location/AddressSection";
import { MapPreviewSection } from "./location/MapPreviewSection";
import { NearbyPlacesSection } from "./location/NearbyPlacesSection";
import { NearbyCitiesSection } from "./location/NearbyCitiesSection";

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
  return (
    <div className="space-y-6">
      <AddressSection 
        formData={formData}
        onFieldChange={onFieldChange}
        onFetchLocationData={onFetchLocationData}
        isLoadingLocationData={isLoadingLocationData}
      />
      
      <MapPreviewSection 
        formData={formData}
        handleMapImageDelete={handleMapImageDelete}
      />
      
      <NearbyPlacesSection 
        formData={formData}
        onRemoveNearbyPlace={onRemoveNearbyPlace}
      />
      
      <NearbyCitiesSection 
        formData={formData}
      />
    </div>
  );
}
