
import { PropertyContentForm } from "./PropertyContentForm";
import { DashboardTabContent } from "./DashboardTabContent";
import { MediaTabContent } from "../media/MediaTabContent";
import { FloorplansTabContent } from "../floorplans/FloorplansTabContent";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";
import { PropertyData, PropertyFormData } from "@/types/property";
import { normalizeImages } from "@/utils/imageHelpers";

interface ContentTabContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onSubmit: () => void;
}

export function renderTabContent(activeTab: string, tabProps: PropertyTabProps) {
  const { property, formState, handlers } = tabProps;
  
  const fullProperty: PropertyData = {
    ...property as PropertyData,
    price: property.price || '',
    address: property.address || '',
    bedrooms: property.bedrooms || '',
    bathrooms: property.bathrooms || '',
    sqft: property.sqft || '',
    description: property.description || '',
    features: formState.features || [],
    areas: formState.areas || [],
    latitude: formState.latitude || null,
    longitude: formState.longitude || null,
    images: normalizeImages(property.images || [])
  };

  // Render the appropriate content based on the active tab
  switch (activeTab) {
    case "dashboard":
      return <DashboardTabContent property={fullProperty} />;
      
    case "content":
      return (
        <PropertyContentForm
          formData={formState}
          onFieldChange={handlers.onFieldChange}
          onAddFeature={handlers.onAddFeature}
          onRemoveFeature={handlers.onRemoveFeature}
          onUpdateFeature={handlers.onUpdateFeature}
          onAddArea={handlers.onAddArea}
          onRemoveArea={handlers.onRemoveArea}
          onUpdateArea={handlers.onUpdateArea}
          onAreaImageUpload={handlers.onAreaImageUpload}
          onAreaImageRemove={handlers.onAreaImageRemove}
          onAreaImagesSelect={handlers.onAreaImagesSelect}
          onFetchLocationData={handlers.onFetchLocationData}
          onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
          isLoadingLocationData={handlers.isLoadingLocationData}
          onSubmit={handlers.onSubmit}
        />
      );
      
    case "media":
      return (
        <MediaTabContent
          property={fullProperty}
          images={normalizeImages(formState.images)}
          handleImageUpload={handlers.handleImageUpload}
          handleRemoveImage={handlers.handleRemoveImage}
          isUploading={handlers.isUploading}
          virtualTourUrl={formState.virtualTourUrl}
          youtubeUrl={formState.youtubeUrl}
          onFieldChange={handlers.onFieldChange}
        />
      );
      
    case "floorplans":
      return (
        <FloorplansTabContent
          property={fullProperty}
          floorplans={formState.floorplans || []}
          handleFloorplanUpload={handlers.handleFloorplanUpload}
          handleRemoveFloorplan={handlers.handleRemoveFloorplan}
          isUploading={handlers.isUploadingFloorplan}
          floorplanEmbedScript={formState.floorplanEmbedScript || ''}
          onFieldChange={handlers.onFieldChange}
        />
      );
      
    case "communications":
      return <CommunicationsTabContent property={fullProperty} />;
      
    default:
      return <div>Select a tab to view content</div>;
  }
}
