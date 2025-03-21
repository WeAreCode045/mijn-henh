
import { usePropertyDataMapper } from "./usePropertyDataMapper";
import { usePropertyStorageService } from "./usePropertyStorageService";
import { useMediaReplacementHandler } from "./useMediaReplacementHandler";
import { useExistingPropertyHandler } from "./useExistingPropertyHandler";
import { useNewPropertyHandler } from "./useNewPropertyHandler";

interface PropertyImportActionsProps {
  xmlData: any[];
  fieldMappings: Record<string, string>;
  setIsImporting?: (value: boolean) => void;
  toast: any;
}

export function usePropertyImportActions({
  xmlData,
  fieldMappings,
  toast
}: PropertyImportActionsProps) {
  const { mapPropertyData } = usePropertyDataMapper();
  const { checkExistingProperty } = usePropertyStorageService();
  const { processExistingProperty } = useExistingPropertyHandler();
  const { processNewProperty } = useNewPropertyHandler();
  const { 
    replaceMediaDialogOpen, 
    setReplaceMediaDialogOpen, 
    currentImportItem, 
    handleMediaReplacement 
  } = useMediaReplacementHandler();

  const importSelectedProperties = async (selectedProperties: number[]) => {
    try {
      const selectedData = xmlData.filter(property => 
        selectedProperties.includes(property.id)
      );

      let imported = 0;
      let updated = 0;
      let errors = 0;
      let skippedMedia = 0;

      for (let i = 0; i < selectedData.length; i++) {
        const property = selectedData[i];
        try {
          // Map XML fields to property fields using the fieldMappings
          const propertyData = mapPropertyData(property, fieldMappings);
          
          // Get object_id - use specific mapping or fallback to property.id
          const objectId = propertyData.object_id || property.id || Math.random().toString(36).substring(2, 9);
          propertyData.object_id = objectId;
          
          // Check for Virtual Tour URL
          if (property.virtualTour) {
            propertyData.virtualTourUrl = property.virtualTour;
          }
          
          // Check for YouTube URL
          if (property.youtubeUrl) {
            propertyData.youtubeUrl = property.youtubeUrl;
          }
          
          // Check if property already exists
          const existingProperty = await checkExistingProperty(objectId, propertyData.title);

          if (existingProperty) {
            // If property exists and has media, ask user what to do
            const imageUrls = property.images || [];
            const floorplanUrls = property.floorplans || [];
            
            if (imageUrls.length > 0 || floorplanUrls.length > 0) {
              // Show dialog and wait for user decision
              const replaceMedia = await handleMediaReplacement(property, propertyData, existingProperty);
              
              // Process property with user's media choice
              const success = await processExistingProperty(
                property, 
                propertyData, 
                existingProperty, 
                replaceMedia
              );
              
              if (success) {
                updated++;
                if (!replaceMedia) {
                  skippedMedia++;
                }
              } else {
                errors++;
              }
            } else {
              // No media to replace, just update the property data
              const success = await processExistingProperty(
                property,
                propertyData,
                existingProperty,
                false
              );
              
              if (success) {
                updated++;
              } else {
                errors++;
              }
            }
          } else {
            // Insert new property
            const success = await processNewProperty(property, propertyData);
            if (success) {
              imported++;
            } else {
              errors++;
            }
          }
        } catch (error) {
          console.error("Error processing property:", error);
          errors++;
        }
      }

      // If dialog is still open, close it
      if (replaceMediaDialogOpen) {
        setReplaceMediaDialogOpen(false);
      }

      const successMessage = [
        imported > 0 ? `${imported} properties imported` : '',
        updated > 0 ? `${updated} properties updated` : '',
        skippedMedia > 0 ? `${skippedMedia} with media preserved` : '',
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
    importSelectedProperties,
    replaceMediaDialogOpen,
    currentImportItem,
    setReplaceMediaDialogOpen
  };
}
