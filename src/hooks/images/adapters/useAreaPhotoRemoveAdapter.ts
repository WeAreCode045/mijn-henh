
/**
 * Adapter hook to convert between different signatures of handleRemoveAreaPhoto
 * This allows compatibility between components expecting different signatures
 */
export function useAreaPhotoRemoveAdapter(
  originalHandler: (areaId: string, imageId: string) => void
) {
  // Convert the (areaId, imageId) signature to (index) signature
  const adaptedHandlerForIndexOnly = (index: number) => {
    // Use a default areaId for general area photos
    const areaId = "general";
    // Create an imageId from the index
    const imageId = `area-photo-${index}`;
    // Call the original handler with the converted parameters
    originalHandler(areaId, imageId);
  };

  return adaptedHandlerForIndexOnly;
}
