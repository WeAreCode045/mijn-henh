
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";

export function usePropertyStorageService() {
  // Check if property exists by object_id
  const checkExistingProperty = async (objectId: string, title?: string) => {
    try {
      // First try to find by object_id
      const { data: existingPropertyByObjectId } = await supabase
        .from('properties')
        .select('id, title')
        .eq('object_id', objectId)
        .maybeSingle();
      
      if (existingPropertyByObjectId) {
        return existingPropertyByObjectId;
      }
      
      // If not found and we have a title, try to find by title as fallback
      if (title) {
        const { data: existingPropertyByTitle } = await supabase
          .from('properties')
          .select('id, title')
          .eq('title', title)
          .maybeSingle();
        
        if (existingPropertyByTitle) {
          return existingPropertyByTitle;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error checking existing property:", error);
      return null;
    }
  };

  // Insert or update property
  const storeProperty = async (propertyData: any, existingId: string | null, operation: 'insert' | 'update') => {
    try {
      if (operation === 'update' && existingId) {
        console.log(`Updating property ${existingId}`);
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', existingId);
        
        if (error) throw error;
        return existingId;
      } else {
        console.log(`Inserting new property: ${propertyData.title}`);
        const { data, error } = await supabase
          .from('properties')
          .insert(propertyData)
          .select('id')
          .single();
        
        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error(`Error ${operation === 'update' ? 'updating' : 'inserting'} property:`, error);
      return null;
    }
  };

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
    checkExistingProperty,
    storeProperty,
    downloadAndUploadImage,
    processImages
  };
}
