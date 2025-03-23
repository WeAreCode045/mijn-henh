
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyModeButtons } from "./PropertyModeButtons";
import { PropertyContentTab } from '../content/PropertyContentTab';
import { MediaTabContent } from '../media/MediaTabContent';
import { DashboardTabContent } from '../content/DashboardTabContent';
import { CommunicationsTabContent } from './CommunicationsTabContent';

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  isArchived?: boolean;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  handleSaveObjectId?: (objectId: string) => Promise<void>;
  handleSaveAgent?: (agentId: string) => Promise<void>;
  handleSaveTemplate?: (templateId: string) => Promise<void>;
  handleGeneratePDF?: () => void;
  handleWebView?: () => void; // Updated to not require an event parameter
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
  handleImageUpload: (files: FileList) => Promise<void>;
  handleRemoveImage: (url: string) => Promise<void>;
  isUploading: boolean;
  handleAreaPhotosUpload: (areaId: string, files: FileList) => Promise<void>;
  handleFloorplanUpload: (files: FileList) => Promise<void>;
  handleRemoveFloorplan: (url: string) => Promise<void>;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (url: string) => Promise<void>;
  handleToggleFeaturedImage: (url: string) => Promise<void>;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  onSubmit?: () => void;
  handleRemoveAreaPhoto?: (areaId: string, photoId: string) => void;
  setPendingChanges?: (value: boolean) => void;
  isSaving?: boolean;
  onFetchLocationData?: () => Promise<void>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<void>;
}

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  isUpdating,
  isArchived = false,
  onSave,
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
  onSubmit,
  setPendingChanges
}: PropertyTabContentsProps) {
  const handleModeButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent form submission
    action();
  };

  return (
    <>
      <TabsContent value="dashboard" className="space-y-8">
        <DashboardTabContent 
          property={property}
          onDelete={onDelete}
          agentInfo={agentInfo}
          onAssignAgent={handleSaveAgent}
          onEditObjectId={handleSaveObjectId}
        />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-8">
        <PropertyModeButtons 
          onSave={onSave}
          onDelete={onDelete}
          onHandleClick={handleModeButtonClick}
        />
        <PropertyContentTab 
          formData={formState}
          property={property}
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
            isUploading,
            onSubmit: onSave || (() => {}),
            isSaving: isUpdating,
          }}
        />
      </TabsContent>
      
      <TabsContent value="media" className="space-y-8">
        <PropertyModeButtons 
          onSave={onSave}
          onDelete={onDelete}
          onHandleClick={handleModeButtonClick}
        />
        <MediaTabContent 
          property={property}
          formState={formState}
          onFieldChange={onFieldChange}
          handleVirtualTourUpdate={handleVirtualTourUpdate}
          handleYoutubeUrlUpdate={handleYoutubeUrlUpdate}
          handleFloorplanEmbedScriptUpdate={handleFloorplanEmbedScriptUpdate}
          isReadOnly={isArchived}
        />
      </TabsContent>
      
      <TabsContent value="communications" className="space-y-8">
        <CommunicationsTabContent propertyId={property.id} />
      </TabsContent>
    </>
  );
}
