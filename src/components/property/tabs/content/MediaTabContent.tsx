
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { MediaGalleryTab } from "../media/MediaGalleryTab";

interface MediaTabContentProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  isReadOnly?: boolean;
}

export function MediaTabContent({ 
  property, 
  formState, 
  onFieldChange,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  isReadOnly = false
}: MediaTabContentProps) {
  return (
    <MediaGalleryTab 
      property={property} 
      formState={formState}
      onFieldChange={onFieldChange}
      handleVirtualTourUpdate={handleVirtualTourUpdate}
      handleYoutubeUrlUpdate={handleYoutubeUrlUpdate}
      handleFloorplanEmbedScriptUpdate={handleFloorplanEmbedScriptUpdate}
      isReadOnly={isReadOnly}
    />
  );
}
