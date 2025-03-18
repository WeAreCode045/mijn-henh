
import { PropertyFormData } from "@/types/property";

/**
 * Hook with methods for handling media-related updates (virtual tours, YouTube videos, floorplan embeds)
 */
export function usePropertyMediaHandlers(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  // Handler for updating virtual tour URL
  const handleVirtualTourUpdate = (url: string) => {
    onFieldChange('virtualTourUrl', url);
  };
  
  // Handler for updating YouTube URL
  const handleYoutubeUrlUpdate = (url: string) => {
    onFieldChange('youtubeUrl', url);
  };
  
  // Handler for updating floorplan embed script
  const handleFloorplanEmbedScriptUpdate = (script: string) => {
    onFieldChange('floorplanEmbedScript', script);
  };

  return {
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate
  };
}
