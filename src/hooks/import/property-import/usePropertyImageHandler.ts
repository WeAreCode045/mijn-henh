
import { supabase } from "@/integrations/supabase/client";

export function usePropertyImageHandler() {
  // Helper function to delete existing property media
  const deleteExistingPropertyMedia = async (propertyId: string) => {
    try {
      // First get all existing images
      const { data: existingImages } = await supabase
        .from('property_images')
        .select('id, url')
        .eq('property_id', propertyId);
      
      if (existingImages && existingImages.length > 0) {
        console.log(`Deleting ${existingImages.length} existing media files for property ${propertyId}`);
        
        // Delete from storage if URLs are from Supabase storage
        for (const image of existingImages) {
          if (image.url && image.url.includes('storage/v1')) {
            try {
              // Extract path from URL
              const urlObj = new URL(image.url);
              const pathParts = urlObj.pathname.split('/');
              const bucketIndex = pathParts.findIndex(part => part === 'object');
              
              if (bucketIndex !== -1 && bucketIndex < pathParts.length - 2) {
                const bucket = pathParts[bucketIndex + 1];
                const path = pathParts.slice(bucketIndex + 2).join('/');
                
                console.log(`Attempting to delete file from storage: bucket=${bucket}, path=${path}`);
                await supabase.storage
                  .from(bucket)
                  .remove([path]);
              }
            } catch (error) {
              console.error("Error removing file from storage:", error);
              // Continue with next file even if this one fails
            }
          }
        }
        
        // Delete all image records from database
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyId);
      }
    } catch (error) {
      console.error("Error deleting existing property media:", error);
      throw error;
    }
  };

  // Helper function to handle property images
  const handlePropertyImages = async (images: string[], propertyId: string) => {
    try {
      // Add all images
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: imageUrl,
            is_main: i === 0, // First image is the main image
            type: 'image',
            sort_order: i
          });
      }
    } catch (error) {
      console.error("Error handling property images:", error);
    }
  };

  // Helper function to handle property floorplans
  const handlePropertyFloorplans = async (floorplans: string[], propertyId: string) => {
    try {
      // Add all floorplans
      for (let i = 0; i < floorplans.length; i++) {
        const floorplanUrl = floorplans[i];
        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            url: floorplanUrl,
            type: 'floorplan',
            sort_order: i
          });
      }
    } catch (error) {
      console.error("Error handling property floorplans:", error);
    }
  };

  return {
    handlePropertyImages,
    handlePropertyFloorplans,
    deleteExistingPropertyMedia
  };
}
