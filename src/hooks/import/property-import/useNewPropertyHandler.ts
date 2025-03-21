
import { usePropertyImageHandler } from "./usePropertyImageHandler";
import { usePropertyStorageService } from "./usePropertyStorageService";

export function useNewPropertyHandler() {
  const { handlePropertyImages, handlePropertyFloorplans } = usePropertyImageHandler();
  const { storeProperty, processImages } = usePropertyStorageService();

  const processNewProperty = async (property: any, propertyData: any) => {
    try {
      // Insert new property
      const newPropertyId = await storeProperty(propertyData, null, 'insert');
      
      if (!newPropertyId) {
        return false;
      }

      // Handle images for new property
      const imageUrls = property.images || [];
      if (imageUrls.length > 0) {
        // Download and upload all images
        const uploadedImageUrls = await processImages(imageUrls, newPropertyId, 'photos');
        
        // Add them to the database
        await handlePropertyImages(uploadedImageUrls, newPropertyId);
      }

      // Handle floorplans for new property
      const floorplanUrls = property.floorplans || [];
      if (floorplanUrls.length > 0) {
        // Download and upload all floorplans
        const uploadedFloorplanUrls = await processImages(floorplanUrls, newPropertyId, 'floorplans');
        
        // Add them to the database
        await handlePropertyFloorplans(uploadedFloorplanUrls, newPropertyId);
      }

      return true;
    } catch (error) {
      console.error("Error processing new property:", error);
      return false;
    }
  };

  return {
    processNewProperty
  };
}
