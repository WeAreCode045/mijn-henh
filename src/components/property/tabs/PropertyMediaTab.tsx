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

export function PropertyMediaTab({ property, handlers }) {
  const [formData, setFormData] = useState<PropertyFormData>(property);
  const [activeTab, setActiveTab] = useState("images");
  
  const {
    handleImageUpload,
    handleRemoveImage,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    isUploading,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate
  } = handlers;
  
  const images = Array.isArray(property.images) 
    ? property.images.map(img => typeof img === 'string' ? { id: img, url: img } : img)
    : [];
  
  const featuredImage = property.featuredImage || null;
  const featuredImages = property.featuredImages || [];

  console.log("PropertyMediaTab: floorplanEmbedScript =", property.floorplanEmbedScript);
  console.log("PropertyMediaTab: featuredImageUrl =", property.featuredImage);
  console.log("PropertyMediaTab: featuredImageUrls =", property.featuredImages);

  const handleFetchComplete = (fetchedImages: PropertyImage[]) => {
    const sortedImages = [...fetchedImages].sort((a, b) => {
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order;
      }
      return 0;
    });
    
    console.log("PropertyMediaTab - Received sorted images:", sortedImages);
    setFormData({ ...formData, images: sortedImages });
  };

  useEffect(() => {
    if (property.images && property.images.length > 0) {
      const sortedImages = [...property.images].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      
      setFormData({ ...formData, images: sortedImages });
    }
  }, [property.images]);

  return (
    <div className="space-y-6">
      <MediaDatabaseFetcher
        propertyId={property.id}
        images={property.images}
        onFetchComplete={handleFetchComplete}
      />

      <PropertyImagesCard 
        images={formData.images || property.images}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
        isUploading={isUploading || false}
        featuredImage={property.featuredImage}
        onFeatureImageToggle={handleToggleFeaturedImage}
        onSetMainImage={handleSetFeaturedImage}
      />

      <FloorplansCard 
        floorplans={property.floorplans || []}
        onFloorplanUpload={handleFloorplanUpload}
        onRemoveFloorplan={handleRemoveFloorplan}
        isUploading={isUploadingFloorplan || false}
      />

      <VirtualTourCard 
        id={property.id}
        virtualTourUrl={property.virtualTourUrl}
        youtubeUrl={property.youtubeUrl}
        floorplanEmbedScript={property.floorplanEmbedScript}
        onVirtualTourUpdate={handleVirtualTourUpdate}
        onYoutubeUrlUpdate={handleYoutubeUrlUpdate}
        onFloorplanEmbedScriptUpdate={handleFloorplanEmbedScriptUpdate}
      />
    </div>
  );
}
