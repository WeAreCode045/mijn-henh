
import { useState } from "react";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { useImageUploadHandler } from "./uploads/useImageUploadHandler";
import { useImageRemoveHandler } from "./uploads/useImageRemoveHandler";
import { useImageDatabaseFetcher } from "./uploads/useImageDatabaseFetcher";

export function useMediaUpload(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Use focused hooks for each operation
  const { handleImageUpload } = useImageUploadHandler(formData, setFormData, setIsUploading);
  const { handleRemoveImage } = useImageRemoveHandler(formData, setFormData);
  const { fetchImages } = useImageDatabaseFetcher();

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    fetchImages,
    images: formData?.images || []
  };
}
