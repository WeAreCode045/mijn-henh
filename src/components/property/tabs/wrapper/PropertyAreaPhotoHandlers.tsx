
import { useCallback } from 'react';
import React from 'react';

export function useAdaptedAreaPhotoHandlers(
  handleAreaPhotosUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
  handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>,
  handleRemoveAreaPhoto?: (index: number) => void,
  handleAreaImageRemove?: (areaId: string, imageId: string) => void
) {
  // Adapter for area photos upload (ensures e: ChangeEvent<HTMLInputElement>)
  const adaptedHandleAreaPhotosUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handleAreaPhotosUpload) {
        return handleAreaPhotosUpload(e);
      }
      return Promise.resolve();
    },
    [handleAreaPhotosUpload]
  );

  // Adapter for area image upload (handles both File and FileList)
  const adaptedHandleAreaImageUpload = useCallback(
    async (areaId: string, fileOrFiles: File | FileList) => {
      if (handleAreaImageUpload) {
        if (fileOrFiles instanceof FileList) {
          return handleAreaImageUpload(areaId, fileOrFiles);
        }
        
        // Convert single File to FileList-like object
        const fileList = {
          0: fileOrFiles,
          length: 1,
          item: (index: number) => (index === 0 ? fileOrFiles : null),
          [Symbol.iterator]: function* () {
            yield fileOrFiles;
          }
        } as FileList;
        
        return handleAreaImageUpload(areaId, fileList);
      }
      return Promise.resolve();
    },
    [handleAreaImageUpload]
  );

  // Adapter for remove area photo (converts index to areaId + imageId OR adapts areaId, imageId to index)
  const adaptedHandleRemoveAreaPhoto = useCallback(
    (indexOrAreaId: number | string, imageId?: string) => {
      if (typeof indexOrAreaId === 'number' && handleRemoveAreaPhoto) {
        // If called with index, use handleRemoveAreaPhoto
        handleRemoveAreaPhoto(indexOrAreaId);
      } else if (typeof indexOrAreaId === 'string' && imageId && handleAreaImageRemove) {
        // If called with areaId and imageId, use handleAreaImageRemove
        handleAreaImageRemove(indexOrAreaId, imageId);
      }
    },
    [handleRemoveAreaPhoto, handleAreaImageRemove]
  );

  return {
    adaptedHandleAreaPhotosUpload,
    adaptedHandleAreaImageUpload,
    adaptedHandleRemoveAreaPhoto
  };
}
