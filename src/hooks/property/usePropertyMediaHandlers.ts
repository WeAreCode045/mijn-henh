
import { PropertyData } from "@/types/property";
import { usePropertyImageHandlers } from "./media/usePropertyImageHandlers";
import { usePropertyVirtualTourHandlers } from "./media/usePropertyVirtualTourHandlers";
import { usePropertyFloorplanHandlers } from "./media/usePropertyFloorplanHandlers";

/**
 * Combines all media-related handlers into a single hook
 */
export function usePropertyMediaHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Images handlers
  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload
  } = usePropertyImageHandlers(property, setProperty, setIsSaving, handlers);

  // Virtual tour handlers
  const {
    handleVirtualTourSave,
    handleYoutubeUrlSave
  } = usePropertyVirtualTourHandlers(property, setProperty, setIsSaving, handlers);

  // Floorplan handlers
  const {
    handleFloorplanEmbedScriptSave
  } = usePropertyFloorplanHandlers(property, setProperty, setIsSaving, handlers);

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload,
    handleVirtualTourSave,
    handleYoutubeUrlSave,
    handleFloorplanEmbedScriptSave
  };
}
