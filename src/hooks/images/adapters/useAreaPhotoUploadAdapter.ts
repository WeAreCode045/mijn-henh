
import { ChangeEvent } from 'react';

/**
 * Adapter hook to convert between different signatures of handleAreaPhotosUpload
 * This allows compatibility between components expecting different signatures
 */
export function useAreaPhotoUploadAdapter(
  originalHandler: (areaId: string, files: FileList) => Promise<void>
): (e: ChangeEvent<HTMLInputElement>) => Promise<void> {
  // Convert the (areaId, files) signature to (e) signature
  const adaptedHandler = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files) return Promise.resolve();
    
    // Extract areaId from data attribute
    const areaId = e.target.dataset.areaId || "general";
    
    // Call the original handler with the converted parameters
    return originalHandler(areaId, e.target.files);
  };

  return adaptedHandler;
}

/**
 * Reverse adapter hook to convert from event-based signature to (areaId, files) signature
 * This allows components that expect (areaId, files) to work with event-based handlers
 */
export function useReverseAreaPhotoUploadAdapter(
  eventHandler: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
): (areaId: string, files: FileList) => Promise<void> {
  // Convert from (e) signature to (areaId, files) signature
  const reverseAdaptedHandler = async (areaId: string, files: FileList): Promise<void> => {
    // Create a synthetic event object
    const syntheticEvent = {
      target: {
        files: files,
        dataset: {
          areaId: areaId
        }
      }
    } as unknown as ChangeEvent<HTMLInputElement>;
    
    // Call the event handler with the synthetic event
    return eventHandler(syntheticEvent);
  };
  
  return reverseAdaptedHandler;
}
