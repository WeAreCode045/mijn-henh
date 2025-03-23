import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyModeButtons } from "./PropertyModeButtons";
import { PropertyContentTab } from '../PropertyContentTab';
import { PropertyMediaTab } from '../PropertyMediaTab';
import { PropertyDashboardTab } from '../PropertyDashboardTab';
import { PropertyCommunicationsTab } from '../PropertyCommunicationsTab';

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo?: { id: string; name: string } | null;
  isUpdating: boolean;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  handleSaveObjectId?: (objectId: string) => Promise<void>;
  handleSaveAgent?: (agentId: string) => Promise<void>;
  handleSaveTemplate?: (templateId: string) => Promise<void>;
  handleGeneratePDF?: () => void;
  handleWebView?: () => void;
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
}

export function PropertyTabContents({
  activeTab,
  property,
  formState,
  agentInfo,
  isUpdating,
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
  handleStepClick
}: PropertyTabContentsProps) {
  const handleModeButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent form submission
    action();
  };

  return (
    <>
      <TabsContent value="dashboard" className="space-y-8">
        <PropertyDashboardTab 
          propertyData={property}
          onGeneratePDF={handleGeneratePDF}
          onWebView={handleWebView}
          onEditObjectId={handleSaveObjectId}
          onAssignAgent={handleSaveAgent}
          agentInfo={agentInfo}
          onDelete={onDelete}
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
            handleAreaImageUpload,
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
        <PropertyMediaTab 
          property={property}
          formState={formState}
          onFieldChange={onFieldChange}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          isUploading={isUploading}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveFloorplan={handleRemoveFloorplan}
          isUploadingFloorplan={isUploadingFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleFeaturedImage={handleToggleFeaturedImage}
          handleVirtualTourUpdate={handleVirtualTourUpdate}
          handleYoutubeUrlUpdate={handleYoutubeUrlUpdate}
          handleFloorplanEmbedScriptUpdate={handleFloorplanEmbedScriptUpdate}
        />
      </TabsContent>
      
      <TabsContent value="communications" className="space-y-8">
        <PropertyCommunicationsTab propertyId={property.id} />
      </TabsContent>
    </>
  );
}
