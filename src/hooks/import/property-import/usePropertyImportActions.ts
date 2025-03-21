
import { usePropertyDataMapper } from "./usePropertyDataMapper";
import { usePropertyImageHandler } from "./usePropertyImageHandler";
import { usePropertyStorageService } from "./usePropertyStorageService";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

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
  const { handlePropertyImages, handlePropertyFloorplans, deleteExistingPropertyMedia } = usePropertyImageHandler();
  const { storeProperty, checkExistingProperty } = usePropertyStorageService();
  const [replaceMediaDialogOpen, setReplaceMediaDialogOpen] = useState(false);
  const [currentImportItem, setCurrentImportItem] = useState<{
    property: any,
    propertyData: any,
    existingProperty: any,
    onComplete: (replaceMedia: boolean) => void
  } | null>(null);

  const processPropertyAfterMediaChoice = async (
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
        // Then add the new images
        await handlePropertyImages(images, existingProperty.id);
      }

      // Handle floorplans for existing property
      const floorplans = property.floorplans || [];
      if (floorplans.length > 0 && replaceMedia) {
        // Already deleted media above, just add new floorplans
        await handlePropertyFloorplans(floorplans, existingProperty.id);
      }

      return true;
    } catch (error) {
      console.error("Error processing property after media choice:", error);
      return false;
    }
  };

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
            // If property exists and has media, ask user what to do
            if ((images.length > 0 || floorplans.length > 0)) {
              await new Promise<void>((resolve) => {
                setCurrentImportItem({
                  property,
                  propertyData,
                  existingProperty,
                  onComplete: async (replaceMedia) => {
                    // Close dialog
                    setReplaceMediaDialogOpen(false);
                    
                    // Process property with user's media choice
                    const success = await processPropertyAfterMediaChoice(
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
                    
                    // Continue with next property
                    resolve();
                  }
                });
                setReplaceMediaDialogOpen(true);
              });
            } else {
              // No media to replace, just update the property data
              const success = await storeProperty(propertyData, existingProperty.id, 'update');
              
              if (!success) {
                errors++;
                continue;
              }
              
              updated++;
            }
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
