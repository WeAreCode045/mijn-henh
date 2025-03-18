
import { PropertyData } from "@/types/property";
import { MediaTabContent } from "../media/MediaTabContent";

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
