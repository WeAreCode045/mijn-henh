
import { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { useImageUploadHandler } from "./images/uploads/useImageUploadHandler";
import { useImageRemoveHandler } from "./images/uploads/useImageRemoveHandler";
import { usePropertyAreaPhotos } from "./images/usePropertyAreaPhotos";
import { usePropertyMainImages } from "./images/usePropertyMainImages";
import { usePropertyFloorplans } from "./images/usePropertyFloorplans";

export function usePropertyImages(
  formData: PropertyFormData | null,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);

  // Create a safe version of formData to prevent null errors
  const safeFormData: PropertyFormData = formData || {
    id: '',
    title: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    livingArea: '',
    buildYear: '',
    garages: '',
    energyLabel: '',
    hasGarden: false,
    description: '',
    location_description: '',
    features: [],
    images: [],
    featuredImage: null,
    featuredImages: [],
    areas: [],
    map_image: null,
    nearby_places: [],
    nearby_cities: [],
    latitude: null,
    longitude: null,
    floorplanEmbedScript: '',
    virtualTourUrl: '',
    youtubeUrl: ''
  };

  // Main property images
  const { handleImageUpload } = useImageUploadHandler(safeFormData, setFormData, setIsUploading);
  const { handleRemoveImage } = useImageRemoveHandler(safeFormData, setFormData);

  // Property area photos
  const {
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    isUploading: isUploadingAreaPhotos
  } = usePropertyAreaPhotos(safeFormData, setFormData);

  // Property floorplans
  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  } = usePropertyFloorplans(safeFormData, setFormData);

  // Main image selections (main and featured)
  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage
  } = usePropertyMainImages(safeFormData, setFormData);

  // Combine all upload states
  const isCombinedUploading = isUploading || isUploadingAreaPhotos || isUploadingFloorplan;

  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading: isCombinedUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    // Direct access to the images for components
    images: Array.isArray(safeFormData.images) ? safeFormData.images : []
  };
}
