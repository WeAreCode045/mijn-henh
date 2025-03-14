
import { PropertyData } from "@/types/property";
import { useFloorplanEmbedScriptSave } from "./floorplans/useFloorplanEmbedScriptSave";

/**
 * Handles operations related to property floorplan embed scripts
 * Composes smaller, focused hooks for specific floorplan operations
 */
export function usePropertyFloorplanHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Use specialized hook for the operation
  const { handleFloorplanEmbedScriptSave } = useFloorplanEmbedScriptSave(
    property, 
    setProperty, 
    setIsSaving, 
    handlers
  );

  return {
    handleFloorplanEmbedScriptSave
  };
}
