
import type { PropertyFormData } from "@/types/property";
import { useFloorplanUploadHandler } from "./floorplans/useFloorplanUploadHandler";
import { useFloorplanRemoveHandler } from "./floorplans/useFloorplanRemoveHandler";
import { useFloorplanUpdateHandler } from "./floorplans/useFloorplanUpdateHandler";
import { useFloorplanEmbed } from "./floorplans/useFloorplanEmbed";
import { useState } from "react";

export function usePropertyFloorplans(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Use the separate hooks for each functionality
  const { handleFloorplanUpload } = useFloorplanUploadHandler(formData, setFormData);
  const { handleRemoveFloorplan } = useFloorplanRemoveHandler(formData, setFormData);
  const { handleUpdateFloorplan } = useFloorplanUpdateHandler(formData, setFormData);
  const { handleUpdateFloorplanEmbedScript } = useFloorplanEmbed(formData, setFormData);

  return {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleUpdateFloorplanEmbedScript,
    isUploading
  };
}
