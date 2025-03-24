
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPreviewSection } from "./location/MapPreviewSection";
import { NearbyPlacesSection } from "./location/components/NearbyPlacesSection";
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
  isGeneratingMap = false
}: LocationStepProps) {
  const handleCategorySearch = async (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFetchCategoryPlaces) {
      console.log(`LocationStep: Handling search for category ${category}`);
      // Make the actual API call through the passed function
      return await onFetchCategoryPlaces(category);
    }
    return null;
  };

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
            />
            
            <MapPreviewSection 
              formData={formData}
              onDeleteMapImage={handleMapImageDelete}
              onGenerateMap={onGenerateMap}
              isGeneratingMap={isGeneratingMap}
            />
            
            <NearbyPlacesSection 
              formData={formData}
              onRemoveNearbyPlace={onRemoveNearbyPlace}
              onFieldChange={onFieldChange}
              onFetchCategoryPlaces={onFetchCategoryPlaces}
              isLoadingNearbyPlaces={isLoadingLocationData}
              onSearchClick={handleCategorySearch}
            />
            
            <NearbyCitiesSection 
              formData={formData}
              onFetchLocationData={onFetchLocationData}
              onFetchNearbyCities={onFetchNearbyCities}
              isLoadingLocationData={isLoadingLocationData}
              onFieldChange={onFieldChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
