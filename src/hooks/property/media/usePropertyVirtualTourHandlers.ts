
import { PropertyData } from "@/types/property";
import { useVirtualTourSave } from "./virtualtours/useVirtualTourSave";
import { useYoutubeUrlSave } from "./virtualtours/useYoutubeUrlSave";

/**
 * Handles operations related to property virtual tours
 * Composes smaller, focused hooks for specific virtual tour operations
 */
export function usePropertyVirtualTourHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Use specialized hooks for each operation
  const { handleVirtualTourSave } = useVirtualTourSave(property, setProperty, setIsSaving, handlers);
  const { handleYoutubeUrlSave } = useYoutubeUrlSave(property, setProperty, setIsSaving, handlers);

  return {
    handleVirtualTourSave,
    handleYoutubeUrlSave
  };
}
