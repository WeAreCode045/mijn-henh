
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyArea, PropertyImage, AreaImage } from '@/types/property';

interface UsePropertyFormAreasProps {
  formState: PropertyFormData;
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges: (pending: boolean) => void;
}

export function usePropertyFormAreas({
  formState,
  handleFieldChange,
  setPendingChanges,
}: UsePropertyFormAreasProps) {
  const setFormData = (updater: ((prevState: PropertyFormData) => PropertyFormData) | PropertyFormData) => {
    if (typeof updater === 'function') {
      const newState = updater(formState);
      handleFieldChange('areas', newState.areas);
    } else {
      handleFieldChange('areas', updater.areas);
    }
  };

  // Update the addArea function to include areaImages
  const addArea = () => {
    const newArea: PropertyArea = {
      id: crypto.randomUUID(),
      title: '',
      name: '',
      size: '',
      description: '',
      columns: 2,
      imageIds: [],
      images: [],
      areaImages: []
    };
    
    setFormData((prevState: PropertyFormData): PropertyFormData => ({
      ...prevState,
      areas: [...(prevState.areas || []), newArea]
    }));
    
    setPendingChanges(true);
  };

  const removeArea = (id: string) => {
    setFormData((prevState: PropertyFormData): PropertyFormData => ({
      ...prevState,
      areas: prevState.areas.filter(area => area.id !== id)
    }));
    setPendingChanges(true);
  };

  const updateArea = (id: string, field: keyof PropertyArea, value: any) => {
    setFormData((prevState: PropertyFormData): PropertyFormData => {
      const updatedAreas = prevState.areas.map(area => {
        if (area.id === id) {
          return { ...area, [field]: value };
        }
        return area;
      });
      return {
        ...prevState,
        areas: updatedAreas,
      };
    });
    setPendingChanges(true);
  };

  const handleAreaImageRemove = (areaId: string, imageId: string) => {
    setFormData((prevState: PropertyFormData): PropertyFormData => {
      const updatedAreas = prevState.areas.map(area => {
        if (area.id === areaId) {
          const updatedAreaImages = area.areaImages
            ? area.areaImages.filter((img: AreaImage) => img.ImageID !== imageId)
            : [];

          const updatedImages = Array.isArray(area.images)
            ? area.images.filter(img => {
                if (typeof img === 'string') return img !== imageId;
                if (typeof img === 'object' && 'id' in img) return img.id !== imageId;
                return true;
              })
            : [];

          const updatedImageIds = area.imageIds
            ? area.imageIds.filter(id => id !== imageId)
            : [];

          return {
            ...area,
            areaImages: updatedAreaImages,
            images: updatedImages,
            imageIds: updatedImageIds
          };
        }
        return area;
      });
      return {
        ...prevState,
        areas: updatedAreas
      };
    });
    setPendingChanges(true);
  };

  const handleAreaImagesSelect = (areaId: string, imageIds: string[]) => {
    setFormData((prevState: PropertyFormData): PropertyFormData => {
      const updatedAreas = prevState.areas.map(area => {
        if (area.id === areaId) {
          const areaImages: AreaImage[] = imageIds.map((id, index) => ({
            ImageID: id,
            imageSortOrder: index + 1
          }));

          return {
            ...area,
            areaImages: areaImages,
            imageIds: imageIds,
            images: Array.isArray(prevState.images)
              ? prevState.images.filter(img => {
                  if (typeof img === 'string') return imageIds.includes(img);
                  if (typeof img === 'object' && 'id' in img) return imageIds.includes(img.id);
                  return false;
                })
              : []
          };
        }
        return area;
      });
      return {
        ...prevState,
        areas: updatedAreas
      };
    });
    setPendingChanges(true);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleAreaImageUpload = async (areaId: string, files: FileList) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `properties/${formState.id}/areas/${areaId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading image: ", uploadError);
          throw uploadError;
        }

        // Get the full URL using getPublicUrl
        const { data: publicUrlData } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        // Create a new PropertyImage object
        const newImage: PropertyImage = {
          id: crypto.randomUUID(),
          url: imageUrl,
          filePath: filePath,
          property_id: formState.id,
          area: areaId,
        };

        return newImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setFormData((prevState: PropertyFormData): PropertyFormData => {
        const updatedAreas = prevState.areas.map(area => {
          if (area.id === areaId) {
            const updatedAreaImages = area.areaImages ? [...area.areaImages] : [];

            uploadedImages.forEach((newImage, index) => {
              updatedAreaImages.push({
                ImageID: newImage.id,
                imageSortOrder: updatedAreaImages.length + index + 1
              });
            });

            // Ensure images is an array before trying to spread it
            const existingImages = Array.isArray(area.images) ? area.images : [];
            const existingImageIds = Array.isArray(area.imageIds) ? area.imageIds : [];

            return {
              ...area,
              areaImages: updatedAreaImages,
              imageIds: [...existingImageIds, ...uploadedImages.map(img => img.id)],
              images: [...existingImages, ...uploadedImages] as PropertyImage[]
            };
          }
          return area;
        });

        // Ensure images is an array before trying to spread it
        const existingImages = Array.isArray(prevState.images) ? prevState.images : [];

        return {
          ...prevState,
          areas: updatedAreas,
          images: [...existingImages, ...uploadedImages] as PropertyImage[]
        };
      });
      setPendingChanges(true);
    } catch (error) {
      console.error("Error uploading images: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAreaPhotosUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `properties/${formState.id}/areaPhotos/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading image: ", uploadError);
          throw uploadError;
        }

        // Get the full URL using getPublicUrl
        const { data: publicUrlData } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        // Create a new PropertyImage object
        const newImage: PropertyImage = {
          id: crypto.randomUUID(),
          url: imageUrl,
          filePath: filePath,
          property_id: formState.id,
        };

        return newImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setFormData((prevState: PropertyFormData): PropertyFormData => ({
        ...prevState,
        areaPhotos: [...(prevState.areaPhotos || []), ...uploadedImages] as PropertyImage[]
      }));
      setPendingChanges(true);
    } catch (error) {
      console.error("Error uploading images: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAreaPhoto = (imageId: string) => {
    setFormData((prevState: PropertyFormData): PropertyFormData => ({
      ...prevState,
      areaPhotos: prevState.areaPhotos && Array.isArray(prevState.areaPhotos) 
        ? prevState.areaPhotos.filter((image: PropertyImage) => image.id !== imageId) as PropertyImage[]
        : []
    }));
    setPendingChanges(true);
  };

  return {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect,
    handleAreaImageUpload,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto
  };
}
