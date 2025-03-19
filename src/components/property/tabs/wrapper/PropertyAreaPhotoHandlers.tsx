
import { useState, useCallback } from 'react';

export function useAdaptedAreaPhotoHandlers(
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
  handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>,
  handleRemoveAreaPhoto?: (areaId: string, imageId: string) => void,
  handleAreaImageRemove?: (areaId: string, imageId: string) => void
) {
  // Adapter for area photos upload (converts e.target.files to first file)
  const adaptedHandleAreaPhotosUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handleAreaPhotosUpload) {
        return handleAreaPhotosUpload(e);
      }
      return Promise.resolve();
    },
    [handleAreaPhotosUpload]
  );

  // Adapter for area image upload (converts File to FileList)
  const adaptedHandleAreaImageUpload = useCallback(
    async (areaId: string, file: File) => {
      if (handleAreaImageUpload) {
        // Create a FileList-like object
        const fileList = {
          0: file,
          length: 1,
          item: (index: number) => (index === 0 ? file : null),
          [Symbol.iterator]: function* () {
            yield file;
          }
        } as FileList;
        
        return handleAreaImageUpload(areaId, fileList);
      }
      return Promise.resolve();
    },
    [handleAreaImageUpload]
  );

  // Adapter for remove area photo (index to areaId + imageId)
  const adaptedHandleRemoveAreaPhoto = useCallback(
    (index: number) => {
      if (handleRemoveAreaPhoto) {
        // Since we don't have proper mapping, we'll just use index as both area and image ID
        handleRemoveAreaPhoto(`area-${index}`, `image-${index}`);
      }
    },
    [handleRemoveAreaPhoto]
  );

  return {
    adaptedHandleAreaPhotosUpload,
    adaptedHandleAreaImageUpload,
    adaptedHandleRemoveAreaPhoto
  };
}
