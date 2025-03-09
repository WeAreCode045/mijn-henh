
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
      return renderDashboardTab(property, formState);
    case "content":
      return renderContentTab(formState, handlers);
    case "media":
      return renderMediaTab(property);
    case "floorplans":
      return renderFloorplansTab(property);
    case "communications":
      return renderCommunicationsTab(property);
    default:
      return null;
  }
}

export function renderDashboardTab(property: any, formState: any) {
  if (activeTab === "dashboard") {
    return <DashboardTabContent property={property} />;
  }
  return null;
}

export function renderContentTab(formState: any, handlers: any) {
  if (activeTab === "content") {
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
  }
  return null;
}

export function renderMediaTab(property: any) {
  if (activeTab === "media") {
    return (
      <MediaTabContent
        property={{
          ...property,
          images: normalizeImages(property.images)
        }}
      />
    );
  }
  return null;
}

export function renderFloorplansTab(property: any) {
  if (activeTab === "floorplans") {
    return <FloorplansTabContent property={property} />;
  }
  return null;
}

export function renderCommunicationsTab(property: any) {
  if (activeTab === "communications") {
    return <CommunicationsTabContent property={property} />;
  }
  return null;
}
