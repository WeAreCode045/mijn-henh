
import React, { ChangeEvent } from "react";
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
  // Handle address change - updating to handle input event
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFieldChange("address", e.target.value);
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
            disabled={isReadOnly} // Changed from isDisabled to disabled
            onFetch={onFetchLocationData}
          />
          
          {/* Pass only the props that MapPreview expects */}
          <MapPreview 
            map_image={property.map_image}
            onGenerate={onGenerateMap} // Ensure the component accepts this prop
            isGenerating={isGeneratingMap || false}
            isDisabled={isReadOnly}
          />
          
          {/* Pass only the props that NearbyPlaces expects */}
          <NearbyPlaces 
            places={formState.nearby_places || []}
            cities={formState.nearby_cities || []} // Ensure the component accepts this prop
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
