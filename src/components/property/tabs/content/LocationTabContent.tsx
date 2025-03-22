
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { LocationTab } from "../location/LocationTab";

interface LocationTabContentProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (index: number) => void;
  onUpdateArea: (index: number, field: string, value: any) => void;
  onAreaImageRemove: (areaIndex: number, imageIndex: number) => void;
  onAreaImagesSelect: (areaIndex: number, files: FileList) => void;
  onAreaImageUpload: (areaIndex: number, files: FileList) => void;
  onFetchLocationData: () => Promise<void>;
  onGenerateLocationDescription: () => Promise<void>;
  onGenerateMap: () => Promise<void>;
  onRemoveNearbyPlace: (placeId: string) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<void>;
  isReadOnly?: boolean;
}

export function LocationTabContent({ 
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
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  isReadOnly = false
}: LocationTabContentProps) {
  return (
    <LocationTab 
      property={property}
      formState={formState}
      onFieldChange={onFieldChange}
      onAddArea={onAddArea}
      onRemoveArea={onRemoveArea}
      onUpdateArea={onUpdateArea}
      onAreaImageRemove={onAreaImageRemove}
      onAreaImagesSelect={onAreaImagesSelect}
      onAreaImageUpload={onAreaImageUpload}
      onFetchLocationData={onFetchLocationData}
      onGenerateLocationDescription={onGenerateLocationDescription}
      onGenerateMap={onGenerateMap}
      onRemoveNearbyPlace={onRemoveNearbyPlace}
      isLoadingLocationData={isLoadingLocationData}
      isGeneratingMap={isGeneratingMap}
      onFetchCategoryPlaces={onFetchCategoryPlaces}
      onFetchNearbyCities={onFetchNearbyCities}
      isReadOnly={isReadOnly}
    />
  );
}
