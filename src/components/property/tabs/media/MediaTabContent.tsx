
import React, { useState, useEffect } from "react";
import { PropertyData, PropertyFormData, PropertyImage } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyImagesCard } from "./PropertyImagesCard";
import { FloorplansTab } from "./tabs/FloorplansTab";
import { VirtualToursTab } from "./tabs/VirtualToursTab";
import { usePropertyMediaHandlers } from "@/hooks/property/usePropertyMediaHandlers";

interface MediaTabContentProps {
  property: PropertyData;
  formState?: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (script: string) => void;
  isReadOnly?: boolean;
  handlers?: {
    setPendingChanges?: (pending: boolean) => void;
  };
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
  const [activeTab, setActiveTab] = React.useState("images");
  const [localProperty, setLocalProperty] = React.useState<PropertyData>(property);
  const [isSaving, setIsSaving] = React.useState(false);

  // Update localProperty when property changes
  React.useEffect(() => {
    setLocalProperty(property);
  }, [property]);

  // Use custom hook for media handlers
  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload,
    handleVirtualTourSave,
    handleYoutubeUrlSave,
    handleFloorplanEmbedScriptSave,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  } = usePropertyMediaHandlers(localProperty, setLocalProperty, setIsSaving, {
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="floorplans">Floorplans</TabsTrigger>
          <TabsTrigger value="virtual-tours">Virtual Tours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-6">
          <PropertyImagesCard 
            images={localProperty.images || []} 
            onImageUpload={handleImageUpload} 
            onRemoveImage={handleRemoveImage} 
            isUploading={isSaving}
            featuredImage={localProperty.featuredImage}
            featuredImages={localProperty.featuredImages || []}
            onSetFeaturedImage={handleSetFeaturedImage}
            onToggleFeaturedImage={handleToggleFeaturedImage}
            propertyId={localProperty.id}
            isReadOnly={isReadOnly}
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="space-y-6">
          <FloorplansTab 
            property={localProperty} 
            setProperty={setLocalProperty} 
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            onFloorplanUpload={handleFloorplanUpload}
            onRemoveFloorplan={handleRemoveFloorplan}
            isUploadingFloorplan={isUploadingFloorplan}
            onFloorplanEmbedScriptSave={handleFloorplanEmbedScriptSave}
            isReadOnly={isReadOnly}
          />
        </TabsContent>
        
        <TabsContent value="virtual-tours" className="space-y-6">
          <VirtualToursTab 
            property={localProperty} 
            setProperty={setLocalProperty}
            onVirtualTourSave={handleVirtualTourSave}
            onYoutubeUrlSave={handleYoutubeUrlSave}
            isSaving={isSaving}
            isReadOnly={isReadOnly}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
