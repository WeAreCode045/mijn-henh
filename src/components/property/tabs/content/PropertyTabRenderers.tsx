
import { PropertyData } from "@/types/property";
import { MediaTabContent } from "../media/MediaTabContent";
import { DashboardTabContent } from "./DashboardTabContent";

interface MediaTabRendererProps {
  property: PropertyData;
  handlers: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  };
}

export function MediaTabRenderer(props: MediaTabRendererProps) {
  return (
    <MediaTabContent 
      property={props.property} 
      handlers={props.handlers}
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
