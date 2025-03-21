
import { usePropertyDataMapper } from "./usePropertyDataMapper";
import { usePropertyImageHandler } from "./usePropertyImageHandler";
import { usePropertyStorageService } from "./usePropertyStorageService";

interface PropertyImportActionsProps {
  xmlData: any[];
  fieldMappings: Record<string, string>;
  setIsImporting: (value: boolean) => void;
  toast: any;
}

export function usePropertyImportActions({
  xmlData,
  fieldMappings,
  toast
}: PropertyImportActionsProps) {
  const { mapPropertyData } = usePropertyDataMapper();
  const { handlePropertyImages, handlePropertyFloorplans } = usePropertyImageHandler();
  const { storeProperty, checkExistingProperty } = usePropertyStorageService();

  const importSelectedProperties = async (selectedProperties: number[]) => {
    try {
      const selectedData = xmlData.filter(property => 
        selectedProperties.includes(property.id)
      );

      let imported = 0;
      let updated = 0;
      let errors = 0;

      for (const property of selectedData) {
        try {
          // Map XML fields to property fields using the fieldMappings
          const propertyData = mapPropertyData(property, fieldMappings);
          
          // Process images
          const images = property.images || [];
          const floorplans = property.floorplans || [];
          
          // Check for Virtual Tour URL
          if (property.virtualTour) {
            propertyData.virtualTourUrl = property.virtualTour;
          }
          
          // Check for YouTube URL
          if (property.youtubeUrl) {
            propertyData.youtubeUrl = property.youtubeUrl;
          }
          
          // Get object_id - use specific mapping or fallback to property.id
          const objectId = propertyData.object_id || property.id || Math.random().toString(36).substring(2, 9);
          propertyData.object_id = objectId;
          
          // Check if property already exists
          const existingProperty = await checkExistingProperty(objectId, propertyData.title);

          if (existingProperty) {
            // Update existing property
            const success = await storeProperty(propertyData, existingProperty.id, 'update');
            
            if (!success) {
              errors++;
              continue;
            }

            // Handle images for existing property
            if (images.length > 0) {
              await handlePropertyImages(images, existingProperty.id);
            }

            // Handle floorplans for existing property
            if (floorplans.length > 0) {
              await handlePropertyFloorplans(floorplans, existingProperty.id);
            }

            updated++;
          } else {
            // Insert new property
            const newPropertyId = await storeProperty(propertyData, null, 'insert');
            
            if (!newPropertyId) {
              errors++;
              continue;
            }

            // Handle images for new property
            if (images.length > 0) {
              await handlePropertyImages(images, newPropertyId);
            }

            // Handle floorplans for new property
            if (floorplans.length > 0) {
              await handlePropertyFloorplans(floorplans, newPropertyId);
            }

            imported++;
          }
        } catch (error) {
          console.error("Error processing property:", error);
          errors++;
        }
      }

      const successMessage = [
        imported > 0 ? `${imported} properties imported` : '',
        updated > 0 ? `${updated} properties updated` : '',
        errors > 0 ? `${errors} errors` : ''
      ].filter(Boolean).join(', ');

      toast({
        title: imported > 0 || updated > 0 ? "Import successful" : "Import failed",
        description: successMessage,
        variant: imported > 0 || updated > 0 ? "default" : "destructive",
      });

    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing properties.",
        variant: "destructive",
      });
    }
  };

  return {
    importSelectedProperties
  };
}
