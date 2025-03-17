
/**
 * Adapter hook to convert between different signatures of handleRemoveAreaPhoto
 * This allows compatibility between components expecting different signatures
 */
export function useAreaPhotoRemoveAdapter(
  originalHandler: (areaId: string, imageId: string) => void
) {
  // Convert the (areaId, imageId) signature to (areaId, photoIndex) signature
  const adaptedHandler = (areaId: string, photoIndex: number) => {
    // Create an imageId from the index - this is a simplification
    // In a real implementation, you might need to lookup the actual imageId from the index
    const imageId = `area-photo-${photoIndex}`;
    
    // Call the original handler with the converted parameters
    originalHandler(areaId, imageId);
  };

  return adaptedHandler;
}
