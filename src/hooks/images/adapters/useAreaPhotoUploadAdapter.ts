
import { ChangeEvent } from 'react';

/**
 * Adapter hook to convert between different signatures of handleAreaPhotosUpload
 * This allows compatibility between components expecting different signatures
 */
export function useAreaPhotoUploadAdapter(
  originalHandler: (areaId: string, files: FileList) => Promise<void>
) {
  // Convert the (areaId, files) signature to (e) signature
  const adaptedHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return Promise.resolve();
    
    // Use a default areaId for general area photos
    const areaId = "general";
    
    // Call the original handler with the converted parameters
    return originalHandler(areaId, e.target.files);
  };

  return adaptedHandler;
}
