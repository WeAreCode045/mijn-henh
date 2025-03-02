
import { supabase } from "@/integrations/supabase/client";

export function useFloorplanStorage() {
  const uploadFloorplanFile = async (file: File, propertyId: string) => {
    try {
      const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
      const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
      const filePath = `properties/${propertyId || 'new'}/floorplans/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        filePath: filePath
      };
    } catch (error) {
      console.error('Error uploading floorplan file:', error);
      return { success: false };
    }
  };

  const deleteFloorplanFile = async (filePath?: string) => {
    if (!filePath) return { success: true };
    
    try {
      const { error } = await supabase.storage
        .from('properties')
        .remove([filePath]);
        
      if (error) {
        console.error('Error deleting floorplan file:', error);
        return { success: false };
      }
      return { success: true };
    } catch (err) {
      console.error('Error in file deletion process:', err);
      return { success: false };
    }
  };

  return {
    uploadFloorplanFile,
    deleteFloorplanFile
  };
}
