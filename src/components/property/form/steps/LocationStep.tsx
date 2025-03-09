
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressSection } from "./location/AddressSection";
import { MapPreviewSection } from "./location/MapPreviewSection";
import { NearbyPlacesSection } from "./location/NearbyPlacesSection";
import { NearbyCitiesSection } from "./location/NearbyCitiesSection";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onGenerateLocationDescription,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges
}: LocationStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onFieldChange) {
      onFieldChange(e.target.name as keyof PropertyFormData, e.target.value);
      
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AddressSection 
              formData={formData}
              onFieldChange={onFieldChange}
              onFetchLocationDescription={onGenerateLocationDescription}
              onFetchLocationData={onFetchLocationData}
              isLoadingLocationDescription={isLoadingLocationData}
              isLoadingLocationData={isLoadingLocationData}
            />
            
            <MapPreviewSection 
              latitude={formData.latitude}
              longitude={formData.longitude}
              mapImage={formData.map_image}
            />
            
            <NearbyPlacesSection 
              nearbyPlaces={formData.nearby_places || []}
              onRemovePlace={onRemoveNearbyPlace}
            />
            
            <NearbyCitiesSection 
              nearbyCities={formData.nearby_cities || []}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
