
import { useState } from "react";

export function useMapImage() {
  const [isUploading, setIsUploading] = useState(false);

  return {
    isUploading,
  };
}
