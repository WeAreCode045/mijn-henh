
import { PropertyData } from "@/types/property";
import { useSetFeaturedImage } from "./images/useSetFeaturedImage";
import { useToggleFeaturedImage } from "./images/useToggleFeaturedImage";
import { useRemoveImage } from "./images/useRemoveImage";
import { useUploadImage } from "./images/useUploadImage";

/**
 * Handles operations related to property images (main gallery)
 * Composes smaller, focused hooks for specific image operations
 */
export function usePropertyImageHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  // Use specialized hooks for each operation
  const { handleSetFeaturedImage } = useSetFeaturedImage(property, setProperty, setIsSaving, handlers);
  const { handleToggleFeaturedImage } = useToggleFeaturedImage(property, setProperty, setIsSaving, handlers);
  const { handleRemoveImage } = useRemoveImage(property, setProperty, setIsSaving, handlers);
  const { handleImageUpload } = useUploadImage(property, setProperty, setIsSaving, handlers);

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload
  };
}
