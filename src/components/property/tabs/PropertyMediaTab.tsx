import React, { ChangeEvent } from 'react';
import { PropertyTabProps } from './wrapper/types/PropertyTabTypes';
import { PropertyImage } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { VirtualTourCard } from "./media/VirtualTourCard";
import { MediaDatabaseFetcher } from "./media/MediaDatabaseFetcher";
import { FloorplansCard } from "./media/FloorplansCard";
import { useState, useEffect } from "react";

interface PropertyImagesCardProps {
  images: any[];
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
  featuredImage: string | null;
  onFeatureImageToggle: (url: string) => void;
  onSetMainImage: (url: string | null) => void;
}

interface FloorplansCardProps {
  floorplans: any[];
  onFloorplanUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
  isUploading: boolean;
}

export function PropertyMediaTab({
  property,
  handlers,
  formState
}: PropertyTabProps) {
  const [mediaImages, setMediaImages] = useState<PropertyImage[]>(formState.images);
  
  console.log("PropertyMediaTab: floorplanEmbedScript =", property.floorplanEmbedScript);
  console.log("PropertyMediaTab: featuredImageUrl =", formState.featuredImage);
  console.log("PropertyMediaTab: featuredImageUrls =", formState.featuredImageUrls);

  const handleFetchComplete = (fetchedImages: PropertyImage[]) => {
    const sortedImages = [...fetchedImages].sort((a, b) => {
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order;
      }
      return 0;
    });
    
    console.log("PropertyMediaTab - Received sorted images:", sortedImages);
    setMediaImages(sortedImages);
  };

  useEffect(() => {
    if (formState.images && formState.images.length > 0) {
      const sortedImages = [...formState.images].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      
      setMediaImages(sortedImages);
    }
  }, [formState.images]);

  return (
    <div className="space-y-6">
      <MediaDatabaseFetcher
        propertyId={property.id}
        images={formState.images}
        onFetchComplete={handleFetchComplete}
      />

      <PropertyImagesCard 
        images={mediaImages || formState.images}
        onImageUpload={handlers.handleImageUpload}
        onRemoveImage={handlers.handleRemoveImage}
        isUploading={handlers.isUploading || false}
        featuredImage={formState.featuredImage}
        onFeatureImageToggle={handlers.handleToggleFeaturedImage}
        onSetMainImage={handlers.handleSetFeaturedImage}
      />

      <FloorplansCard 
        floorplans={formState.floorplans || []}
        onFloorplanUpload={handlers.handleFloorplanUpload}
        onRemoveFloorplan={handlers.handleRemoveFloorplan}
        isUploading={handlers.isUploadingFloorplan || false}
      />

      <VirtualTourCard 
        id={property.id}
        virtualTourUrl={property.virtualTourUrl}
        youtubeUrl={property.youtubeUrl}
        floorplanEmbedScript={property.floorplanEmbedScript}
        onVirtualTourUpdate={handlers.handleVirtualTourUpdate}
        onYoutubeUrlUpdate={handlers.handleYoutubeUrlUpdate}
        onFloorplanEmbedScriptUpdate={handlers.handleFloorplanEmbedScriptUpdate}
      />
    </div>
  );
}
