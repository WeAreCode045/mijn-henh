
import { DashboardTabContent } from "./DashboardTabContent";
import { ContentTabContent } from "./ContentTabContent";
import { MediaTabContent } from "../media/MediaTabContent";
import { FloorplansTabContent } from "../floorplans/FloorplansTabContent";
import { CommunicationsTabContent } from "./CommunicationsTabContent";
import { PropertyTabProps } from "../wrapper/types/PropertyTabTypes";
import { normalizeImages } from "@/utils/imageHelpers";
import { PropertyData } from "@/types/property";

export const TabContentRenderers = {
  renderTabContent: function({ activeTab, property, formState, agentInfo, templateInfo, isUpdating, handlers }: PropertyTabProps) {
    // Cast property to PropertyData with all required fields for type safety
    const propertyData = property as PropertyData;
    
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTabContent 
            property={propertyData} 
            onDelete={handlers.onDelete}
          />
        );
      case "content":
        // Define handleNext and handlePrevious for ContentTabContent
        const handleNext = () => {
          if (handlers.currentStep < 3) { // 3 is the max step (0-indexed)
            handlers.handleStepClick(handlers.currentStep + 1);
          }
        };

        const handlePrevious = () => {
          if (handlers.currentStep > 0) {
            handlers.handleStepClick(handlers.currentStep - 1);
          }
        };

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
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            onFetchLocationData={handlers.onFetchLocationData}
            onFetchCategoryPlaces={handlers.onFetchCategoryPlaces}
            onFetchNearbyCities={handlers.onFetchNearbyCities}
            onGenerateLocationDescription={handlers.onGenerateLocationDescription}
            onGenerateMap={handlers.onGenerateMap}
            onRemoveNearbyPlace={handlers.onRemoveNearbyPlace}
            isLoadingLocationData={handlers.isLoadingLocationData}
            isGeneratingMap={handlers.isGeneratingMap}
            setPendingChanges={handlers.setPendingChanges}
            isUploading={false}
            isSaving={handlers.isSaving}
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
};
