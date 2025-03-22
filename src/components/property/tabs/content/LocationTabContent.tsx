
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { LocationTab } from "../location/LocationTab";

interface LocationTabContentProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  onFetchLocationData: () => Promise<void>;
  onGenerateLocationDescription: () => Promise<void>;
  onGenerateMap: () => Promise<void>;
  onRemoveNearbyPlace: (index: number) => void;
  isLoadingLocationData: boolean;
  isGeneratingMap: boolean;
  onFetchCategoryPlaces: (category: string) => Promise<any>;
  onFetchNearbyCities: () => Promise<any>;
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
  // Create adapter functions to match the expected types in LocationTab
  const adaptedRemoveArea = (id: string) => onRemoveArea(id);
  const adaptedUpdateArea = (id: string, field: any, value: any) => onUpdateArea(id, field, value);
  const adaptedAreaImageRemove = (areaId: string, imageId: string) => onAreaImageRemove(areaId, imageId);
  const adaptedAreaImagesSelect = (areaId: string, imageIds: string[]) => onAreaImagesSelect(areaId, imageIds);
  const adaptedAreaImageUpload = (areaId: string, files: FileList) => onAreaImageUpload(areaId, files);
  const adaptedRemoveNearbyPlace = (index: number) => onRemoveNearbyPlace(index);

  return (
    <LocationTab 
      property={property}
      formState={formState}
      onFieldChange={onFieldChange}
      onAddArea={onAddArea}
      onRemoveArea={adaptedRemoveArea}
      onUpdateArea={adaptedUpdateArea}
      onAreaImageRemove={adaptedAreaImageRemove}
      onAreaImagesSelect={adaptedAreaImagesSelect}
      onAreaImageUpload={adaptedAreaImageUpload}
      onFetchLocationData={onFetchLocationData}
      onGenerateLocationDescription={onGenerateLocationDescription}
      onGenerateMap={onGenerateMap}
      onRemoveNearbyPlace={adaptedRemoveNearbyPlace}
      isLoadingLocationData={isLoadingLocationData}
      isGeneratingMap={isGeneratingMap}
      onFetchCategoryPlaces={onFetchCategoryPlaces}
      onFetchNearbyCities={onFetchNearbyCities}
      isReadOnly={isReadOnly}
    />
  );
}
