
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData } from '@/types/property';

export function useAreaImageSelect(
  formData: PropertyFormData,
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
) {
  const { toast } = useToast();

  // Select images from existing property images for an area
  const handleAreaImagesSelect = (areaId: string, imageIds: string[]) => {
    console.log(`Selecting images for area ${areaId}, imageIds:`, imageIds);
    
    const updatedAreas = formData.areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          imageIds: imageIds,
        };
      }
      return area;
    });
    
    setFormData({
      ...formData,
      areas: updatedAreas,
    });
    
    const areaTitle = formData.areas.find(a => a.id === areaId)?.title || 'area';
    
    toast({
      title: "Success",
      description: `Updated images for "${areaTitle}"`,
    });
  };

  return {
    handleAreaImagesSelect
  };
}
