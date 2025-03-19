
import React from "react";
import { PropertyFormData, PropertyData } from "@/types/property";
import { MediaTabContent } from "../media/MediaTabContent";
import { DashboardTabContent } from "../content/DashboardTabContent";
import { CommunicationsTabContent } from "../communications/CommunicationsTabContent";
import { ContentTabWrapper } from "../content/ContentTabWrapper";

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo: { id: string; name: string };
  templateInfo: { id: string; name: string };
  isUpdating: boolean;
  onDelete?: () => Promise<void>;
  handleSaveObjectId?: (objectId: string) => void;
  handleSaveAgent?: (agentId: string) => void;
  handleSaveTemplate?: (templateId: string) => void;
  handleGeneratePDF?: () => void;
  handleWebView?: (e?: React.MouseEvent) => void;
  
  // Content tab props
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  
  // Media tab props
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveAreaPhoto: (areaId: string, imageId: string) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveFloorplan: (index: number) => void;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleFeaturedImage: (url: string) => void;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  
  // Step form props
  currentStep: number;
  handleStepClick: (step: number) => void;
  setPendingChanges?: (pending: boolean) => void;
  
  // Location tab props
  onFetchLocationData?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  
  // Submission
  onSubmit: () => void;
  lastSaved?: Date | null;
  isSaving?: boolean;
}

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  templateInfo,
  isUpdating,
  onDelete,
  handleSaveObjectId,
  handleSaveAgent,
  handleSaveTemplate,
  handleGeneratePDF,
  handleWebView,
  onFieldChange,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImagesSelect,
  onAreaImageUpload,
  handleImageUpload,
  handleRemoveImage,
  isUploading,
  handleAreaPhotosUpload,
  handleRemoveAreaPhoto,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  isUploadingFloorplan,
  handleSetFeaturedImage,
  handleToggleFeaturedImage,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  currentStep,
  handleStepClick,
  setPendingChanges,
  onFetchLocationData,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onSubmit,
  lastSaved,
  isSaving
}: PropertyTabContentsProps) {
  
  // Show appropriate tab content based on active tab
  const renderTabContent = () => {
    console.log("Rendering tab content for:", activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTabContent 
            property={property}
            onDelete={onDelete}
            onWebView={handleWebView}
            handleSaveAgent={handleSaveAgent}
            handleSaveObjectId={handleSaveObjectId}
            handleSaveTemplate={handleSaveTemplate}
            handleGeneratePDF={handleGeneratePDF instanceof Function ? handleGeneratePDF : undefined}
            isUpdating={isUpdating}
            agentInfo={agentInfo}
            templateInfo={templateInfo}
          />
        );
      
      case 'content':
        return (
          <ContentTabWrapper
            formData={formState}
            handlers={{
              onFieldChange,
              onAddFeature,
              onRemoveFeature,
              onUpdateFeature,
              onAddArea,
              onRemoveArea,
              onUpdateArea,
              onAreaImageRemove,
              onAreaImagesSelect,
              handleAreaImageUpload: onAreaImageUpload,
              currentStep,
              handleStepClick,
              onFetchLocationData,
              onFetchCategoryPlaces,
              onFetchNearbyCities,
              onGenerateLocationDescription,
              onGenerateMap,
              onRemoveNearbyPlace,
              isLoadingLocationData,
              isGeneratingMap,
              setPendingChanges,
              isUploading,
              isSaving
            }}
          />
        );
        
      case 'media':
        return (
          <MediaTabContent 
            property={property}
            handlers={{
              handleVirtualTourUpdate,
              handleYoutubeUrlUpdate,
              handleFloorplanEmbedScriptUpdate,
              setPendingChanges
            }}
          />
        );

      case 'communications':
        return (
          <CommunicationsTabContent property={property} />
        );
        
      default:
        return (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Select a tab to view content</p>
          </div>
        );
    }
  };

  return renderTabContent();
}
