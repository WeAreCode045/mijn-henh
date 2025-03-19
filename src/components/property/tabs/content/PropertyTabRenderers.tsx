
import { PropertyData, PropertyFormData } from "@/types/property";
import { MediaTabContent } from "../media/MediaTabContent";
import { DashboardTabContent } from "./DashboardTabContent";
import { ContentTabWrapper } from "./ContentTabWrapper";

interface MediaTabRendererProps {
  property: PropertyData;
  handlers: {
    handleVirtualTourUpdate: (url: string) => void;
    handleYoutubeUrlUpdate: (url: string) => void;
    handleFloorplanEmbedScriptUpdate: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  };
}

export function MediaTabRenderer(props: MediaTabRendererProps) {
  console.log("MediaTabRenderer - Property data:", props.property);
  
  // Ensure all required handlers are provided with default implementations
  const handlers = {
    handleVirtualTourUpdate: props.handlers.handleVirtualTourUpdate,
    handleYoutubeUrlUpdate: props.handlers.handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate: props.handlers.handleFloorplanEmbedScriptUpdate,
    setPendingChanges: props.handlers.setPendingChanges
  };
  
  return (
    <MediaTabContent 
      property={props.property} 
      handlers={handlers}
    />
  );
}

interface DashboardTabRendererProps {
  property: PropertyData;
  handlers: {
    onDelete?: () => Promise<void>;
    onWebView?: (e?: React.MouseEvent) => void;
    handleSaveAgent?: (agentId: string) => void;
    handleSaveObjectId?: (objectId: string) => void;
    handleSaveTemplate?: (templateId: string) => void;
    handleGeneratePDF?: (e: React.MouseEvent) => void;
    isUpdating?: boolean;
  };
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function DashboardTabRenderer(props: DashboardTabRendererProps) {
  return (
    <DashboardTabContent 
      property={props.property}
      onDelete={props.handlers.onDelete}
      onWebView={props.handlers.onWebView}
      handleSaveAgent={props.handlers.handleSaveAgent}
      handleSaveObjectId={props.handlers.handleSaveObjectId}
      handleSaveTemplate={props.handlers.handleSaveTemplate}
      handleGeneratePDF={props.handlers.handleGeneratePDF}
      isUpdating={props.handlers.isUpdating}
      agentInfo={props.agentInfo}
      templateInfo={props.templateInfo}
    />
  );
}

interface ContentTabRendererProps {
  formData: PropertyFormData;
  handlers: {
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
    handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
    currentStep: number;
    handleStepClick: (step: number) => void;
    onFetchLocationData?: () => Promise<void>;
    onFetchCategoryPlaces?: (category: string) => Promise<any>;
    onFetchNearbyCities?: () => Promise<any>;
    onGenerateLocationDescription?: () => Promise<void>;
    onGenerateMap?: () => Promise<void>;
    onRemoveNearbyPlace?: (index: number) => void;
    isLoadingLocationData?: boolean;
    isGeneratingMap?: boolean;
    setPendingChanges?: (pending: boolean) => void;
    isUploading?: boolean;
    isSaving?: boolean;
  };
}

export function ContentTabRenderer(props: ContentTabRendererProps) {
  console.log("ContentTabRenderer - Form data:", props.formData);
  console.log("ContentTabRenderer - Current step:", props.handlers.currentStep);
  
  return (
    <ContentTabWrapper
      formData={props.formData}
      handlers={props.handlers}
    />
  );
}
