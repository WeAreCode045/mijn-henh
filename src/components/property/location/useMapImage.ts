
import { useState } from "react";

export function useMapImage() {
  const [isUploading, setIsUploading] = useState(false);
  
  // This hook could be expanded in the future if needed
  const startUpload = () => setIsUploading(true);
  const endUpload = () => setIsUploading(false);

  return {
    isUploading,
    startUpload,
    endUpload
  };
}
