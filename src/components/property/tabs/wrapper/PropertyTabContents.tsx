
import React from 'react';
import { PropertyData, PropertyFormData, PropertyTabsValue } from '@/types/property';
import { CommunicationsTabContent } from '../content/CommunicationsTabContent';
import { ContentTabRenderer, DashboardTabRenderer, MediaTabRenderer } from '../content/PropertyTabRenderers';

interface PropertyTabContentsProps {
  activeTab: string;
  property: PropertyData;
  formState: PropertyFormData;
  agentInfo: { id: string; name: string } | null;
  templateInfo: { id: string; name: string } | null;
  isUpdating: boolean;
  onDelete: () => Promise<void>;
  handleSaveObjectId?: (objectId: string) => void;
  handleSaveAgent?: (agentId: string) => void;
  handleSaveTemplate?: (templateId: string) => void;
  handleGeneratePDF?: (e: React.MouseEvent) => void;
  handleWebView?: (e?: React.MouseEvent) => void;
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
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  isUploading: boolean;
  handleAreaPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveAreaPhoto: (index: number) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveFloorplan: (index: number) => void;
  isUploadingFloorplan: boolean;
  handleSetFeaturedImage: (url: string | null) => void;
  handleToggleFeaturedImage: (url: string) => void;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  currentStep: number;
  handleStepClick: (step: number) => void;
  setPendingChanges?: (pending: boolean) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  onSubmit: () => void;
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
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  onSubmit
}: PropertyTabContentsProps) {
  // Check which tab is active and render the corresponding content
  switch (activeTab) {
    case PropertyTabsValue.DASHBOARD:
      return (
        <DashboardTabRenderer
          property={property}
          handlers={{
            onDelete,
            onWebView: handleWebView,
            handleSaveAgent,
            handleSaveObjectId,
            handleSaveTemplate,
            handleGeneratePDF,
            isUpdating
          }}
          agentInfo={agentInfo}
          templateInfo={templateInfo}
        />
      );
    case PropertyTabsValue.CONTENT:
      return (
        <ContentTabRenderer
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
            onAreaImageUpload,
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
            onSubmit
          }}
        />
      );
    case PropertyTabsValue.MEDIA:
      return (
        <MediaTabRenderer
          property={property}
          handlers={{
            handleVirtualTourUpdate,
            handleYoutubeUrlUpdate,
            handleFloorplanEmbedScriptUpdate,
            setPendingChanges
          }}
        />
      );
    case PropertyTabsValue.COMMUNICATIONS:
      return <CommunicationsTabContent property={property} />;
    default:
      return (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p>Select a tab to view content</p>
        </div>
      );
  }
}
