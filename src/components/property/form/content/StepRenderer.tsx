
import React from "react";
import { PropertyArea, PropertyFeature, PropertyFloorplan, PropertyFormData, PropertyTechnicalItem } from "@/types/property";
import { steps } from "../formSteps";

type CommonStepProps = {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  isUploading?: boolean;
};

interface StepRendererProps extends CommonStepProps {
  step: number;
  onAddFeature?: () => void;
  onRemoveFeature?: (id: string) => void;
  onUpdateFeature?: (id: string, description: string) => void;
  onAddArea?: () => void;
  onRemoveArea?: (id: string) => void;
  onUpdateArea?: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  handleRemoveAreaPhoto?: (index: number) => void;
  handleRemoveFloorplan?: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleGridImage?: (url: string) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
}

export function StepRenderer({
  step,
  formData,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageUpload,
  onAreaImageRemove,
  onAreaImagesSelect,
  handleImageUpload,
  handleAreaPhotosUpload,
  handleFloorplanUpload,
  handleRemoveImage,
  handleRemoveAreaPhoto,
  handleRemoveFloorplan,
  handleUpdateFloorplan,
  handleSetFeaturedImage,
  handleToggleGridImage,
  handleMapImageDelete,
  onFetchLocationData,
  onRemoveNearbyPlace,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  isUploading,
}: StepRendererProps) {
  // Find the step component that corresponds to the current step
  const StepComponent = steps.find(s => s.id === step)?.component;
  
  // Add defensive check
  if (!StepComponent) {
    console.error(`Step component not found for step: ${step}`);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-500">Error: Step not found. Please try refreshing the page.</p>
      </div>
    );
  }

  // When passing props to StepComponent, make sure to include the 'step' property
  return <StepComponent {...getStepProps(step, {
    step,  // Add the step property here
    formData,
    onFieldChange,
    onAddFeature,
    onRemoveFeature,
    onUpdateFeature,
    onAddArea,
    onRemoveArea,
    onUpdateArea,
    onAreaImageUpload,
    onAreaImageRemove,
    onAreaImagesSelect,
    handleImageUpload,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveImage,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage,
    handleMapImageDelete,
    onFetchLocationData,
    onRemoveNearbyPlace,
    onAddTechnicalItem,
    onRemoveTechnicalItem,
    onUpdateTechnicalItem,
    isUploading
  })} />;
}

// Helper function to get the appropriate props for the current step
function getStepProps(step: number, allProps: StepRendererProps): any {
  // Ensure formData exists in all cases
  const safeFormData = {
    ...allProps.formData,
    features: allProps.formData.features || [],
    images: allProps.formData.images || [],
    floorplans: allProps.formData.floorplans || [],
    areas: allProps.formData.areas || [],
    technicalItems: allProps.formData.technicalItems || [],
    nearby_places: allProps.formData.nearby_places || []
  };

  // Common props that all steps might need
  const commonProps = {
    formData: safeFormData,
    onFieldChange: allProps.onFieldChange,
    isUploading: allProps.isUploading
  };

  // Return specific props based on step
  switch (step) {
    case 3: // TechnicalDataStep
      return {
        floorplans: safeFormData.floorplans,
        technicalItems: safeFormData.technicalItems,
        images: safeFormData.images,
        onFloorplanUpload: allProps.handleFloorplanUpload,
        onRemoveFloorplan: allProps.handleRemoveFloorplan,
        onUpdateFloorplan: allProps.handleUpdateFloorplan,
        onAddTechnicalItem: allProps.onAddTechnicalItem,
        onRemoveTechnicalItem: allProps.onRemoveTechnicalItem,
        onUpdateTechnicalItem: allProps.onUpdateTechnicalItem,
        isUploading: allProps.isUploading
      };
    case 4: // AreasStep
      return {
        areas: safeFormData.areas,
        images: safeFormData.images,
        onAddArea: allProps.onAddArea,
        onRemoveArea: allProps.onRemoveArea,
        onUpdateArea: allProps.onUpdateArea,
        onAreaImageUpload: allProps.onAreaImageUpload,
        onAreaImageRemove: allProps.onAreaImageRemove,
        onAreaImagesSelect: allProps.onAreaImagesSelect,
        isUploading: allProps.isUploading
      };
    case 2: // FeaturesStep
      return {
        features: safeFormData.features,
        onAddFeature: allProps.onAddFeature,
        onRemoveFeature: allProps.onRemoveFeature,
        onUpdateFeature: allProps.onUpdateFeature
      };
    case 5: // LocationStep
      return {
        address: safeFormData.address || "",
        latitude: safeFormData.latitude,
        longitude: safeFormData.longitude,
        location_description: safeFormData.location_description,
        map_image: safeFormData.map_image,
        nearby_places: safeFormData.nearby_places,
        onFieldChange: allProps.onFieldChange,
        onMapImageDelete: allProps.handleMapImageDelete,
        onFetchLocationData: allProps.onFetchLocationData,
        onRemoveNearbyPlace: allProps.onRemoveNearbyPlace,
        isUploading: allProps.isUploading
      };
    case 1: // GeneralInfoStep
      return {
        formData: safeFormData,
        onFieldChange: allProps.onFieldChange,
        handleSetFeaturedImage: allProps.handleSetFeaturedImage,
        onSetFeaturedImage: allProps.handleSetFeaturedImage,
        isUploading: allProps.isUploading
      };
    case 6: // FloorplansStep
      return {
        formData: safeFormData,
        onFieldChange: allProps.onFieldChange,
        handleFloorplanUpload: allProps.handleFloorplanUpload,
        handleRemoveFloorplan: allProps.handleRemoveFloorplan,
        handleUpdateFloorplan: allProps.handleUpdateFloorplan,
        isUploading: allProps.isUploading
      };
    default:
      // For any other steps, return all props
      return allProps;
  }
}
