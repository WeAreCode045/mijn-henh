
import { useAreaPhotoRemoveAdapter } from "@/hooks/images/adapters/useAreaPhotoRemoveAdapter";
import { useAreaPhotoUploadAdapter, useReverseAreaPhotoUploadAdapter } from "@/hooks/images/adapters/useAreaPhotoUploadAdapter";
import { ChangeEvent } from "react";

interface AdaptedAreaPhotoHandlers {
  adaptedHandleAreaPhotosUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  adaptedHandleRemoveAreaPhoto: (areaId: string, photoIdOrIndex: string | number) => void;
  adaptedHandleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
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
  
  // If handleAreaPhotosUpload is already provided with the event-based signature, use it directly
  // Otherwise, adapt the originalUploadHandler to have the event-based signature
  const adaptedHandleAreaPhotosUpload = handleAreaPhotosUpload || useAreaPhotoUploadAdapter(originalUploadHandler);
  
  // Also provide a files-based handler for components that need it
  // If handleAreaImageUpload is already provided, use it directly
  // Otherwise, adapt the event-based handler to have the files-based signature
  const adaptedHandleAreaImageUpload = handleAreaImageUpload || 
    (handleAreaPhotosUpload ? useReverseAreaPhotoUploadAdapter(handleAreaPhotosUpload) : originalUploadHandler);
  
  const adaptedHandleRemoveAreaPhoto = useAreaPhotoRemoveAdapter(originalRemoveHandler);
  
  return {
    adaptedHandleAreaPhotosUpload,
    adaptedHandleRemoveAreaPhoto,
    adaptedHandleAreaImageUpload
  };
}
