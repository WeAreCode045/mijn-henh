
import { DashboardTabContent } from "./DashboardTabContent";
import { ContentTabContent } from "./ContentTabContent";
import { MediaTabContent } from "../media/MediaTabContent";
import { FloorplansTabContent } from "../floorplans/FloorplansTabContent";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";
import { normalizeImages } from "@/utils/imageHelpers";

export function renderTabContent({ activeTab, property, formState, agentInfo, templateInfo, isUpdating, handlers }: PropertyTabProps) {
  switch (activeTab) {
    case "dashboard":
      return <DashboardTabContent property={property} />;
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
            ...property,
            images: normalizeImages(property.images)
          }}
        />
      );
    case "floorplans":
      return <FloorplansTabContent property={property} />;
    case "communications":
      return <CommunicationsTabContent property={property} />;
    default:
      return null;
  }
}
