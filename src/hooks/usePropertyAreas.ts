
import { useToast } from "@/components/ui/use-toast";
import type { PropertyArea, PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyAreas(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const addArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      imageIds: [],
      columns: 2 // Default to 2 columns
    };

    setFormData({
      ...formData,
      areas: [...formData.areas, newArea]
    });
  };

  const removeArea = (id: string) => {
    setFormData({
      ...formData,
      areas: formData.areas.filter(area => area.id !== id)
    });
  };

  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[] | number) => {
    setFormData({
      ...formData,
      areas: formData.areas.map(area =>
        area.id === id ? { ...area, [field]: value } : area
      )
    });
  };

  const handleAreaImageUpload = async (areaId: string, files: FileList) => {
    try {
      const area = formData.areas.find(a => a.id === areaId);
      if (!area) return;

      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/areas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        // Add the new image to the images array
        const newImageId = crypto.randomUUID();
        const newImage = {
          id: newImageId,
          url: publicUrl
        };

        // Create a new images array with the new image
        const updatedImages = [...formData.images, newImage];
        
        // Update the form data directly instead of using a callback function
        setFormData({
          ...formData,
          images: updatedImages
        });

        return newImageId;
      });

      const newImageIds = await Promise.all(uploadPromises);
      const imageIds = [...(area.imageIds || []), ...newImageIds];
      updateArea(areaId, 'imageIds', imageIds);

      toast({
        title: "Success",
        description: "Area images uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading area images:', error);
      toast({
        title: "Error",
        description: "Failed to upload area images",
        variant: "destructive",
      });
    }
  };

  const removeAreaImage = async (areaId: string, imageId: string) => {
    try {
      const area = formData.areas.find(a => a.id === areaId);
      if (!area) return;

      const imageIds = area.imageIds.filter(id => id !== imageId);
      updateArea(areaId, 'imageIds', imageIds);

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing area image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    removeAreaImage
  };
}
