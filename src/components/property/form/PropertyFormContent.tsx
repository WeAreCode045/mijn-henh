import { PropertyFormData, PropertyArea, PropertyFeature, PropertyFloorplan, PropertyTechnicalItem } from "@/types/property";
import { steps } from "./formSteps";

interface PropertyFormContentProps {
  step: number;
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveAreaPhoto: (index: number) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleGridImage: (url: string) => void;
  handleMapImageDelete?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  isUploading?: boolean;
}

export function PropertyFormContent({
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
}: PropertyFormContentProps) {
  
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

  // If formData is not available, show a loading state
  if (!formData) {
    return (
      <div className="py-4 flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ensure all arrays exist in formData to prevent null reference errors
  const safeFormData = {
    ...formData,
    features: formData.features || [],
    images: formData.images || [],
    floorplans: formData.floorplans || [],
    areas: formData.areas || [],
    technicalItems: formData.technicalItems || [],
    nearby_places: formData.nearby_places || []
  };

  // Pass all props to the step component based on the type of step
  return (
    <div className="py-4 animate-fadeIn">
      {step === 3 ? (
        // TechnicalDataStep
        <StepComponent
          floorplans={safeFormData.floorplans}
          technicalItems={safeFormData.technicalItems}
          images={safeFormData.images}
          onFloorplanUpload={handleFloorplanUpload}
          onRemoveFloorplan={handleRemoveFloorplan}
          onUpdateFloorplan={handleUpdateFloorplan}
          onAddTechnicalItem={onAddTechnicalItem}
          onRemoveTechnicalItem={onRemoveTechnicalItem}
          onUpdateTechnicalItem={onUpdateTechnicalItem}
          isUploading={isUploading}
        />
      ) : step === 4 ? (
        // AreasStep
        <StepComponent
          areas={safeFormData.areas}
          images={safeFormData.images}
          onAddArea={onAddArea}
          onRemoveArea={onRemoveArea}
          onUpdateArea={onUpdateArea}
          onAreaImageUpload={onAreaImageUpload}
          onAreaImageRemove={onAreaImageRemove}
          onAreaImagesSelect={onAreaImagesSelect}
          isUploading={isUploading}
        />
      ) : step === 2 ? (
        // FeaturesStep
        <StepComponent
          features={safeFormData.features}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          onUpdateFeature={onUpdateFeature}
        />
      ) : step === 5 ? (
        // LocationStep
        <StepComponent
          address={safeFormData.address || ""}
          latitude={safeFormData.latitude}
          longitude={safeFormData.longitude}
          location_description={safeFormData.location_description}
          map_image={safeFormData.map_image}
          nearby_places={safeFormData.nearby_places}
          onFieldChange={onFieldChange}
          onMapImageDelete={handleMapImageDelete}
          onFetchLocationData={onFetchLocationData}
          onRemoveNearbyPlace={onRemoveNearbyPlace}
          isUploading={isUploading}
        />
      ) : step === 1 ? (
        // GeneralInfoStep - special handling for step 1
        <StepComponent
          formData={safeFormData}
          onFieldChange={onFieldChange}
          handleSetFeaturedImage={handleSetFeaturedImage}
          onSetFeaturedImage={handleSetFeaturedImage} // Add alternative prop name
          isUploading={isUploading}
        />
      ) : step === 6 ? (
        // FloorplansStep - specific handling for FloorplansStep
        <StepComponent
          formData={safeFormData}
          onFieldChange={onFieldChange}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleUpdateFloorplan={handleUpdateFloorplan}
          isUploading={isUploading}
        />
      ) : (
        // Other steps
        <StepComponent
          formData={safeFormData}
          onFieldChange={onFieldChange}
          onAddFeature={onAddFeature}
          onRemoveFeature={onRemoveFeature}
          onUpdateFeature={onUpdateFeature}
          onAddArea={onAddArea}
          onRemoveArea={onRemoveArea}
          onUpdateArea={onUpdateArea}
          onAreaImageUpload={onAreaImageUpload}
          onAreaImageRemove={onAreaImageRemove}
          onAreaImagesSelect={onAreaImagesSelect}
          onFloorplanUpload={handleFloorplanUpload}
          onRemoveFloorplan={handleRemoveFloorplan}
          onUpdateFloorplan={handleUpdateFloorplan}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onAreaPhotosUpload={handleAreaPhotosUpload}
          onRemoveAreaPhoto={handleRemoveAreaPhoto}
          onSetFeaturedImage={handleSetFeaturedImage}
          handleSetFeaturedImage={handleSetFeaturedImage}
          onToggleGridImage={handleToggleGridImage}
          onMapImageDelete={handleMapImageDelete}
          onFetchLocationData={onFetchLocationData}
          onRemoveNearbyPlace={onRemoveNearbyPlace}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
