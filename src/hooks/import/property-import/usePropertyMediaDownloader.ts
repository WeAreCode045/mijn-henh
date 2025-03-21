
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
      
      // Download the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      // Get the file data and create a File object
      const blob = await response.blob();
      const filename = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
      
      // Generate a unique path for the file
      const filePath = `properties/${propertyId}/${folderType}/${crypto.randomUUID()}-${filename}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('properties')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);
      
      console.log(`Successfully uploaded image to ${publicUrl}`);
      return publicUrl;
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
