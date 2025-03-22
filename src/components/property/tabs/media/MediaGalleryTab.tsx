
import React from "react";
import { PropertyData, PropertyFormData } from "@/types/property";
import { PropertyImagesCard } from "./PropertyImagesCard";
import { FloorplansCard } from "./FloorplansCard";
import { VirtualTourCard } from "./VirtualTourCard";

interface MediaGalleryTabProps {
  property: PropertyData;
  formState: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleVirtualTourUpdate: (url: string) => void;
  handleYoutubeUrlUpdate: (url: string) => void;
  handleFloorplanEmbedScriptUpdate: (script: string) => void;
  isReadOnly?: boolean;
}

export function MediaGalleryTab({
  property,
  formState,
  onFieldChange,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  isReadOnly = false
}: MediaGalleryTabProps) {
  return (
    <div className="space-y-6">
      <PropertyImagesCard 
        property={property} 
        isReadOnly={isReadOnly}
      />
      
      <FloorplansCard 
        property={property}
        handleFloorplanEmbedScriptUpdate={handleFloorplanEmbedScriptUpdate}
        isReadOnly={isReadOnly}
      />
      
      <VirtualTourCard 
        property={property}
        handleVirtualTourUpdate={handleVirtualTourUpdate}
        handleYoutubeUrlUpdate={handleYoutubeUrlUpdate}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
