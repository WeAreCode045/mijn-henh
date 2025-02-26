
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload() {
  const uploadFile = async (file: File, propertyId: string, folder: 'photos' | 'floorplans' | 'location'): Promise<string> => {
    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
    const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
    const filePath = `properties/${propertyId}/${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('properties')
      .upload(filePath, file);
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(filePath);
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return publicUrl;
  };

  return { uploadFile };
}
