
import { useState } from "react";
import { PropertyArea, PropertyFormData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { normalizeImage } from "@/utils/imageHelpers";

export function usePropertyAreaPhotos(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Upload area photos
  const handleAreaPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    try {
      const areaId = e.target.dataset.areaId;
      if (!areaId) {
        throw new Error("Area ID is missing");
      }

      // Process each file
      const files = Array.from(e.target.files);
      const uploadedImages: PropertyImage[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `areas/${areaId}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (data.publicUrl) {
          const newImage: PropertyImage = {
            id: crypto.randomUUID(),
            url: data.publicUrl,
            area: areaId,
            type: "image"
          };
          uploadedImages.push(newImage);
        }
      }

      // Find the area and add the images to it
      const updatedAreas = formData.areas.map(area => {
        if (area.id === areaId) {
          // Ensure area.images is an array and all items are PropertyImage objects
          const normalizedImages = Array.isArray(area.images) 
            ? area.images.map(img => normalizeImage(img))
            : [];
          return {
            ...area,
            images: [...normalizedImages, ...uploadedImages]
          };
        }
        return area;
      });

      // Update form data with the updated areas
      setFormData({
        ...formData,
        areas: updatedAreas
      });

      toast({
        title: "Success",
        description: `Uploaded ${files.length} image(s) to area`,
      });
    } catch (error) {
      console.error("Error uploading area images:", error);
      toast({
        title: "Error",
        description: "Failed to upload area images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove area photo
  const handleRemoveAreaPhoto = (areaId: string, imageId: string) => {
    const updatedAreas = formData.areas.map(area => {
      if (area.id === areaId) {
        // Ensure area.images is an array and all items are PropertyImage objects
        const normalizedImages = Array.isArray(area.images) 
          ? area.images.map(img => normalizeImage(img))
          : [];
        return {
          ...area,
          images: normalizedImages.filter(image => image.id !== imageId)
        };
      }
      return area;
    });

    setFormData({
      ...formData,
      areas: updatedAreas
    });
  };

  return {
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    isUploading
  };
}
