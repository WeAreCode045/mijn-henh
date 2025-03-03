
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useImageUploadHandler } from "./images/uploads/useImageUploadHandler";
import { useImageRemoveHandler } from "./images/uploads/useImageRemoveHandler";
import type { PropertyFormData, PropertyImage } from "@/types/property";
import { usePropertyMainImages } from "./images/usePropertyMainImages";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "./images/usePropertyFloorplans";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // Handlers for regular property images
  const { handleImageUpload } = useImageUploadHandler(formData, setFormData, setIsUploading);
  const { handleRemoveImage } = useImageRemoveHandler(formData, setFormData);
  
  // Handler for area photos
  const { 
    handleAreaPhotosUpload, 
    handleRemoveAreaPhoto
  } = usePropertyAreaPhotos(formData, setFormData);
  
  // Handlers for floorplans
  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan
  } = usePropertyFloorplans(formData, setFormData);
  
  // Handlers for featured and grid images
  const {
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyMainImages(formData, setFormData);
  
  return {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage,
    isUploading,
    images: formData.images || []
  };
}
