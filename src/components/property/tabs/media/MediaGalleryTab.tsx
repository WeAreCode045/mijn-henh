
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
      {/* Extract relevant props from property to match PropertyImagesCard's expected props */}
      <PropertyImagesCard 
        images={property.images || []}
        onImageUpload={() => console.log("Image upload not implemented")}
        onRemoveImage={() => console.log("Remove image not implemented")}
        isUploading={false}
        propertyId={property.id}
        featuredImage={property.featuredImage}
        featuredImages={property.featuredImages || []}
      />
      
      {/* Extract relevant props from property to match FloorplansCard's expected props */}
      <FloorplansCard 
        floorplans={property.floorplans || []}
        onFloorplanUpload={() => console.log("Floorplan upload not implemented")}
        onRemoveFloorplan={() => console.log("Remove floorplan not implemented")}
        isUploading={false}
        propertyId={property.id}
      />
      
      {/* Extract relevant props from property to match VirtualTourCard's expected props */}
      <VirtualTourCard 
        id={property.id}
        virtualTourUrl={property.virtualTourUrl || ""}
        youtubeUrl={property.youtubeUrl || ""}
        onVirtualTourUpdate={handleVirtualTourUpdate}
        onYoutubeUrlUpdate={handleYoutubeUrlUpdate}
      />
    </div>
  );
}
