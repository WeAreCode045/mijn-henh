
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useImageUploadHandler } from "./images/uploads/useImageUploadHandler";
import { useImageRemoveHandler } from "./images/uploads/useImageRemoveHandler";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "./images/usePropertyFloorplans";
import { usePropertyMainImages } from "./images/usePropertyMainImages";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);

  // Main property images
  const { handleImageUpload } = useImageUploadHandler(formData, setFormData, setIsUploading);
  const { handleRemoveImage } = useImageRemoveHandler(formData, setFormData);

  // Property area photos
  const {
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    isUploading: isUploadingAreaPhotos
  } = usePropertyAreaPhotos(formData, setFormData);

  // Property floorplans
  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    isUploading: isUploadingFloorplans
  } = usePropertyFloorplans(formData, setFormData);

  // Main image selections (main and featured)
  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage
  } = usePropertyMainImages(formData, setFormData);

  // Combine all upload states
  const isCombinedUploading = isUploading || isUploadingAreaPhotos || isUploadingFloorplans;

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading: isCombinedUploading,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    // Direct access to the images for components
    images: Array.isArray(formData.images) ? formData.images : []
  };
}
