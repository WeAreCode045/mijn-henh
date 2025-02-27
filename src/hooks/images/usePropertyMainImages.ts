
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from "@/types/property";

export function usePropertyMainImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        const { data, error } = await supabase
          .from('property_images')
          .insert({
            property_id: formData.id,
            url: publicUrl
          })
          .select('id, url')
          .single();

        if (error) throw error;

        return data as PropertyImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Ensure images is always an array
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      
      setFormData({
        ...formData,
        images: [...currentImages, ...uploadedImages]
      });

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (!Array.isArray(formData.images) || index < 0 || index >= formData.images.length) {
      console.error('Invalid image index or images array is not defined');
      return;
    }

    const imageToRemove = formData.images[index];
    if (!imageToRemove || !imageToRemove.id) {
      console.error('Image not found or has no ID');
      return;
    }

    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageToRemove.id);

      if (error) throw error;

      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index)
      });

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return {
    handleImageUpload,
    handleRemoveImage,
    images: formData?.images || []
  };
}
