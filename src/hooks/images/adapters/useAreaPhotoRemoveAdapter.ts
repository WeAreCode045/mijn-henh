
/**
 * Adapter hook to convert between different signatures of handleRemoveAreaPhoto
 * This allows compatibility between components expecting different signatures
 */
export function useAreaPhotoRemoveAdapter(
  originalHandler: (areaId: string, imageId: string) => void
) {
  // Convert the (areaId, imageId) signature to (areaId, photoIndex) signature
  // and vice versa, ensuring string type for imageId
  const adaptedHandler = (areaId: string, photoIdOrIndex: string | number) => {
    // If we received a number, convert it to a string ID
    // In a real implementation, you might need to lookup the actual imageId from the index
    const imageId = typeof photoIdOrIndex === 'number' 
      ? `area-photo-${photoIdOrIndex}` 
      : photoIdOrIndex;
    
    // Call the original handler with the converted parameters
    originalHandler(areaId, imageId);
  };

  return adaptedHandler;
}
