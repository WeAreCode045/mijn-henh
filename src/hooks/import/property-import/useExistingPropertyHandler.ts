
import { usePropertyImageHandler } from "./usePropertyImageHandler";
import { usePropertyStorageService } from "./usePropertyStorageService";

export function useExistingPropertyHandler() {
  const { handlePropertyImages, handlePropertyFloorplans, deleteExistingPropertyMedia } = usePropertyImageHandler();
  const { storeProperty, processImages } = usePropertyStorageService();

  const processExistingProperty = async (
    property: any, 
    propertyData: any, 
    existingProperty: any, 
    replaceMedia: boolean
  ) => {
    try {
      // Update existing property
      const success = await storeProperty(propertyData, existingProperty.id, 'update');
      
      if (!success) {
        return false;
      }

      // Handle images for existing property
      const images = property.images || [];
      if (images.length > 0 && replaceMedia) {
        // Delete existing media first
        await deleteExistingPropertyMedia(existingProperty.id);
        
        // Download and upload the new images
        const uploadedImageUrls = await processImages(images, existingProperty.id, 'photos');
        
        // Then add the new images
        await handlePropertyImages(uploadedImageUrls, existingProperty.id);
      }

      // Handle floorplans for existing property
      const floorplans = property.floorplans || [];
      if (floorplans.length > 0 && replaceMedia) {
        // Download and upload the new floorplans
        const uploadedFloorplanUrls = await processImages(floorplans, existingProperty.id, 'floorplans');
        
        // Add them to the database
        await handlePropertyFloorplans(uploadedFloorplanUrls, existingProperty.id);
      }

      return true;
    } catch (error) {
      console.error("Error processing existing property:", error);
      return false;
    }
  };

  return {
    processExistingProperty
  };
}
