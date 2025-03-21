
import { useState } from "react";

export interface MediaReplacementItem {
  property: any;
  propertyData: any;
  existingProperty: any;
  onComplete: (replaceMedia: boolean) => void;
}

export function useMediaReplacementHandler() {
  const [replaceMediaDialogOpen, setReplaceMediaDialogOpen] = useState(false);
  const [currentImportItem, setCurrentImportItem] = useState<MediaReplacementItem | null>(null);

  const handleMediaReplacement = async (
    property: any, 
    propertyData: any, 
    existingProperty: any
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setCurrentImportItem({
        property,
        propertyData,
        existingProperty,
        onComplete: (replaceMedia) => {
          setReplaceMediaDialogOpen(false);
          resolve(replaceMedia);
        }
      });
      setReplaceMediaDialogOpen(true);
    });
  };

  return {
    replaceMediaDialogOpen,
    setReplaceMediaDialogOpen,
    currentImportItem,
    handleMediaReplacement
  };
}
