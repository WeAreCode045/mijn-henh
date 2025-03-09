
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
  const propertyWithRequiredFields = property as PropertyData;
  
  switch (activeTab) {
    case "dashboard":
      return <DashboardTabContent property={propertyWithRequiredFields} />;
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
          onAreaImageUpload={handlers.onAreaImageUpload}
          onAreaImageRemove={handlers.onAreaImageRemove}
          onAreaImagesSelect={handlers.onAreaImagesSelect}
          currentStep={handlers.currentStep}
          handleStepClick={handlers.handleStepClick}
          handleNext={handlers.handleNext}
          handlePrevious={handlers.handlePrevious}
          onFetchLocationData={handlers.onFetchLocationData}
          onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
          isLoadingLocationData={handlers.isLoadingLocationData}
        />
      );
    case "media":
      return (
        <MediaTabContent
          property={{
            ...propertyWithRequiredFields,
            images: normalizeImages(property.images)
          }}
        />
      );
    case "floorplans":
      return <FloorplansTabContent property={propertyWithRequiredFields} />;
    case "communications":
      return <CommunicationsTabContent property={propertyWithRequiredFields} />;
    default:
      return null;
  }
}
