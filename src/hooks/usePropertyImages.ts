
import type { PropertyFormData, PropertyFloorplan } from "@/types/property";
import { usePropertyMainImages } from "./images/usePropertyMainImages";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "./images/usePropertyFloorplans";
import { usePropertyFeaturedImage } from "./images/usePropertyFeaturedImage";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { handleImageUpload, handleRemoveImage, isUploading, images } = usePropertyMainImages(formData, setFormData);
  const { handleAreaPhotosUpload, handleRemoveAreaPhoto } = usePropertyAreaPhotos(formData, setFormData);
  const { handleFloorplanUpload, handleRemoveFloorplan, handleUpdateFloorplan } = usePropertyFloorplans(formData, setFormData);
  const { handleSetFeaturedImage, handleToggleGridImage } = usePropertyFeaturedImage(formData, setFormData);

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleGridImage,
    images: formData?.images || []
  };
}
