
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData } from "@/types/property";
import { useState } from "react";

export function usePropertyAreaPhotos(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleAreaPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/location/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      
      if (urls.length > 0 && (!formData.areaPhotos || formData.areaPhotos.length === 0)) {
        const areaId = crypto.randomUUID();
        const newArea = {
          id: areaId,
          title: 'Location Photos',
          description: 'Photos of the surrounding area',
          imageIds: [],
          columns: 2 // Default to 2 columns
        };
        
        setFormData({
          ...formData,
          areas: [...formData.areas, newArea],
          areaPhotos: [...(formData.areaPhotos || []), ...urls]
        });
      } else {
        setFormData({
          ...formData,
          areaPhotos: [...(formData.areaPhotos || []), ...urls]
        });
      }

      toast({
        title: "Success",
        description: "Area photos uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading area photos:', error);
      toast({
        title: "Error",
        description: "Failed to upload area photos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAreaPhoto = (index: number) => {
    setFormData({
      ...formData,
      areaPhotos: formData.areaPhotos?.filter((_, i) => i !== index) || []
    });
  };

  return {
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    isUploading
  };
}
