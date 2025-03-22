
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AddressInput 
            address={formState.address || ""}
            onChange={(value) => onFieldChange("address", value)}
            onFetchLocationData={onFetchLocationData}
            isLoading={isLoadingLocationData}
            isDisabled={isReadOnly}
          />
          
          <MapPreview 
            property={property}
            onGenerateMap={onGenerateMap}
            isGenerating={isGeneratingMap}
            isDisabled={isReadOnly}
          />
          
          <NearbyPlaces 
            property={property}
            formState={formState}
            onRemovePlace={onRemoveNearbyPlace}
            onFetchCategoryPlaces={onFetchCategoryPlaces}
            onFetchNearbyCities={onFetchNearbyCities}
            isDisabled={isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
}
