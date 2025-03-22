
import { supabase } from "@/integrations/supabase/client";

export function usePropertyMediaDownloader() {
  // Download remote image and upload to Supabase storage
  const downloadAndUploadImage = async (
    imageUrl: string, 
    propertyId: string, 
    folderType: 'photos' | 'floorplans' | 'location'
  ): Promise<string | null> => {
    try {
      console.log(`Downloading image from ${imageUrl} for property ${propertyId}`);
      
      // Call the Supabase Edge Function that handles image downloading and uploading
      const { data, error } = await supabase.functions.invoke('download-image', {
        body: {
          imageUrl,
          propertyId,
          folder: folderType
        }
      });
      
      if (error) {
        console.error("Error calling download-image function:", error);
        return null;
      }
      
      if (!data || !data.publicUrl) {
        console.error("No valid URL returned from download-image function");
        return null;
      }
      
      console.log(`Successfully downloaded and uploaded image to ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error("Error downloading and uploading image:", error);
      return null;
    }
  };

  // Download and process multiple images
  const processImages = async (
    imageUrls: string[], 
    propertyId: string, 
    folderType: 'photos' | 'floorplans' | 'location'
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const url of imageUrls) {
      try {
        const publicUrl = await downloadAndUploadImage(url, propertyId, folderType);
        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        }
      } catch (error) {
        console.error(`Error processing image ${url}:`, error);
      }
    }
    
    return uploadedUrls;
  };

  return {
    downloadAndUploadImage,
    processImages
  };
}
