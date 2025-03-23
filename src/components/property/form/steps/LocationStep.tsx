
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPreviewSection } from "./location/MapPreviewSection";
import { NearbyPlacesSection } from "./location/NearbyPlacesSection";
import { NearbyCitiesSection } from "./location/NearbyCitiesSection";
import { LocationDescriptionSection } from "./location/LocationDescriptionSection";

interface LocationStepProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  handleMapImageDelete?: () => Promise<void>;
  isReadOnly?: boolean;
}

export function LocationStep({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  setPendingChanges,
  handleMapImageDelete,
  onGenerateMap,
  isGeneratingMap = false,
  isReadOnly = false
}: LocationStepProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <LocationDescriptionSection 
              formData={formData}
              onFieldChange={onFieldChange}
              onGenerateDescription={onGenerateLocationDescription}
              isGeneratingDescription={isLoadingLocationData}
              isReadOnly={isReadOnly}
            />
            
            <MapPreviewSection 
              formData={formData}
              onDeleteMapImage={handleMapImageDelete}
              onGenerateMap={onGenerateMap}
              isGeneratingMap={isGeneratingMap}
              isReadOnly={isReadOnly}
            />
            
            <NearbyPlacesSection 
              formData={formData}
              onRemovePlace={onRemoveNearbyPlace}
              onFieldChange={onFieldChange}
              onFetchNearbyPlaces={onFetchCategoryPlaces}
              isLoadingNearbyPlaces={isLoadingLocationData}
              isReadOnly={isReadOnly}
            />
            
            <NearbyCitiesSection 
              formData={formData}
              onFetchLocationData={onFetchLocationData}
              onFetchNearbyCities={onFetchNearbyCities}
              isLoadingLocationData={isLoadingLocationData}
              onFieldChange={onFieldChange}
              isReadOnly={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
