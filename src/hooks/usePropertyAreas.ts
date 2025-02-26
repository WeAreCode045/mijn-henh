
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
      imageIds: []
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

  const updateArea = (id: string, field: keyof PropertyArea, value: string | string[]) => {
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

      const imageIds = area.imageIds || [];
      updateArea(areaId, 'imageIds', imageIds);

      toast({
        title: "Success",
        description: "Area images updated successfully",
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
