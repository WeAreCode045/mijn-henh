
import { PropertyData } from "@/types/property";
import { MediaTabContent } from "../media/MediaTabContent";

interface MediaTabRendererProps {
  property: PropertyData;
  onVirtualTourUpdate: (url: any) => any;
  onYoutubeUrlUpdate: (url: any) => any;
  onFloorplanEmbedScriptUpdate: (script: any) => any;
  onImageUpload: any;
  onRemoveImage: any;
  isUploading: any;
}

export function MediaTabRenderer(props: MediaTabRendererProps) {
  return (
    <MediaTabContent property={props.property} />
  );
}
