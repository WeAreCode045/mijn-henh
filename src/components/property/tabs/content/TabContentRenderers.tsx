
import { DashboardTabContent } from "./DashboardTabContent";
import { ContentTabContent } from "./ContentTabContent";
import { MediaTabContent } from "../media/MediaTabContent";
import { FloorplansTabContent } from "../floorplans/FloorplansTabContent";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";
import { normalizeImages } from "@/utils/imageHelpers";
import { PropertyData } from "@/types/property";

export function renderTabContent({ activeTab, property, formState, agentInfo, templateInfo, isUpdating, handlers }: PropertyTabProps) {
  // Cast property to PropertyData with all required fields for type safety
  const propertyData = property as PropertyData;
  
  switch (activeTab) {
    case "dashboard":
      return (
        <DashboardTabContent 
          property={propertyData} 
          onDelete={handlers.onDelete}
          onSave={handlers.onSave}
          onWebView={handlers.handleWebView}
        />
      );
    case "content":
      return (
        <ContentTabContent
          formData={formState}
          onFieldChange={handlers.onFieldChange}
          onAddFeature={handlers.onAddFeature}
          onRemoveFeature={handlers.onRemoveFeature}
          onUpdateFeature={handlers.onUpdateFeature}
          onAddArea={handlers.onAddArea}
          onRemoveArea={handlers.onRemoveArea}
          onUpdateArea={handlers.onUpdateArea}
          onAreaImageRemove={handlers.onAreaImageRemove}
          onAreaImagesSelect={handlers.onAreaImagesSelect}
          handleAreaImageUpload={handlers.handleAreaImageUpload}
          currentStep={handlers.currentStep}
          handleStepClick={handlers.handleStepClick}
          handleNext={handlers.handleNext}
          handlePrevious={handlers.handlePrevious}
          onFetchLocationData={handlers.onFetchLocationData}
          onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
          isLoadingLocationData={handlers.isLoadingLocationData}
          setPendingChanges={handlers.setPendingChanges || (() => {})}
          isUploading={handlers.isUploading}
        />
      );
    case "media":
      // Pass the property data to the MediaTabContent component
      return (
        <MediaTabContent
          property={{
            ...propertyData,
            images: normalizeImages(property.images)
          }}
        />
      );
    case "floorplans":
      return <FloorplansTabContent property={propertyData} />;
    case "communications":
      return <CommunicationsTabContent property={propertyData} />;
    default:
      return null;
  }
}
