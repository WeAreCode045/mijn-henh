
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();

  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (!e.target.files?.length) return;

    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        const filePath = `properties/${formData.id || 'new'}/floorplans/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        return {
          url: publicUrl,
          columns: 1 // Default to 1 column
        };
      });

      const newFloorplans = await Promise.all(uploadPromises);
      
      // Ensure floorplans is an array
      const currentFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      
      setFormData({
        ...formData,
        floorplans: [...currentFloorplans, ...newFloorplans]
      });

      toast({
        title: "Success",
        description: "Floorplans uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading floorplans:', error);
      toast({
        title: "Error",
        description: "Failed to upload floorplans",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFloorplan = (index: number) => {
    console.log("Removing floorplan at index:", index);
    
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      console.error('Invalid floorplan index or floorplans array is not defined');
      return;
    }
    
    // Update any technical items that reference this floorplan
    const updatedTechnicalItems = (formData.technicalItems || []).map(item => {
      // If this technical item references the removed floorplan or any after it (by index)
      if (item.floorplanId !== null) {
        const floorplanIndex = parseInt(item.floorplanId);
        if (floorplanIndex === index) {
          // This technical item referenced the removed floorplan
          return { ...item, floorplanId: null };
        } else if (floorplanIndex > index) {
          // This technical item referenced a floorplan after the removed one
          // Decrement the index to maintain correct references
          return { ...item, floorplanId: (floorplanIndex - 1).toString() };
        }
      }
      return item;
    });
    
    setFormData({
      ...formData,
      floorplans: formData.floorplans.filter((_, i) => i !== index),
      technicalItems: updatedTechnicalItems
    });
    
    toast({
      title: "Success", 
      description: "Floorplan removed successfully"
    });
  };

  const handleUpdateFloorplan = (index: number, field: keyof PropertyFloorplan, value: any) => {
    console.log(`Updating floorplan at index ${index}, field ${String(field)}, value:`, value);
    
    if (!Array.isArray(formData.floorplans) || index < 0 || index >= formData.floorplans.length) {
      console.error('Invalid floorplan index or floorplans array is not defined');
      return;
    }
    
    const updatedFloorplans = [...formData.floorplans];
    updatedFloorplans[index] = {
      ...updatedFloorplans[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      floorplans: updatedFloorplans
    });
  };

  const handleUpdateFloorplanEmbedScript = (script: string) => {
    console.log("Updating floorplan embed script:", script);
    setFormData({
      ...formData,
      floorplanEmbedScript: script
    });
    
    // Log to confirm the update
    console.log("Updated formData with floorplanEmbedScript:", formData.floorplanEmbedScript);
  };

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleUpdateFloorplanEmbedScript
  };
}
