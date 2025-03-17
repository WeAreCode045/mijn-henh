
import { useAreaPhotoRemoveAdapter } from "@/hooks/images/adapters/useAreaPhotoRemoveAdapter";
import { useAreaPhotoUploadAdapter } from "@/hooks/images/adapters/useAreaPhotoUploadAdapter";
import { ChangeEvent } from "react";

interface AdaptedAreaPhotoHandlers {
  adaptedHandleAreaPhotosUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  adaptedHandleRemoveAreaPhoto: (areaId: string, photoIndex: number) => void;
}

/**
 * Creates adapted handlers for area photo operations to manage type compatibility
 */
export function useAdaptedAreaPhotoHandlers(
  handleAreaPhotosUpload?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>,
  handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>,
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void,
  handleAreaImageRemove?: (areaId: string, imageId: string) => void
): AdaptedAreaPhotoHandlers {
  // Create a proper fallback handler for uploads with the correct signature
  const originalUploadHandler = (areaId: string, files: FileList): Promise<void> => {
    if (handleAreaImageUpload) {
      return handleAreaImageUpload(areaId, files);
    }
    
    return Promise.resolve();
  };
  
  // Create a proper fallback handler for removals with the correct signature
  const originalRemoveHandler = (areaId: string, imageId: string): void => {
    if (handleRemoveAreaPhoto) {
      handleRemoveAreaPhoto(areaId, imageId);
      return;
    }
    
    if (handleAreaImageRemove) {
      handleAreaImageRemove(areaId, imageId);
    }
  };
  
  // Create the adapted handlers using our adapter hooks
  const adaptedHandleAreaPhotosUpload = useAreaPhotoUploadAdapter(originalUploadHandler);
  const adaptedHandleRemoveAreaPhoto = useAreaPhotoRemoveAdapter(originalRemoveHandler);
  
  return {
    adaptedHandleAreaPhotosUpload,
    adaptedHandleRemoveAreaPhoto
  };
}
