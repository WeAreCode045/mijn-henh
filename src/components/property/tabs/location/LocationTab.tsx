
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressInput } from "../../location/AddressInput";
import { MapPreview } from "../../location/MapPreview";
import { NearbyPlaces } from "../../location/NearbyPlaces";

interface LocationTabProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  isReadOnly?: boolean;
}

export function LocationTab({
  property,
  formState,
  onFieldChange,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  isReadOnly = false
}: LocationTabProps) {
  // Handle address change
  const handleAddressChange = (value: string) => {
    onFieldChange("address", value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pass only the props that AddressInput expects */}
          <AddressInput 
            address={formState.address || ""}
            onChange={handleAddressChange}
            isLoading={isLoadingLocationData || false}
            isDisabled={isReadOnly}
            onFetch={onFetchLocationData}
          />
          
          {/* Pass only the props that MapPreview expects */}
          <MapPreview 
            mapImage={property.map_image}
            onGenerate={onGenerateMap}
            isGenerating={isGeneratingMap || false}
            isDisabled={isReadOnly}
          />
          
          {/* Pass only the props that NearbyPlaces expects */}
          <NearbyPlaces 
            nearbyPlaces={formState.nearby_places || []}
            nearbyCities={formState.nearby_cities || []}
            onRemove={onRemoveNearbyPlace}
            onFetchCategory={onFetchCategoryPlaces}
            onFetchCities={onFetchNearbyCities}
            isDisabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
}
