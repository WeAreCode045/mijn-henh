
import React, { useState, useEffect } from "react";
import { PropertyData, PropertyImage, PropertyFloorplan } from "@/types/property";
import { ImageUploader } from "@/components/property/form/media/ImageUploader";
import { FloorplanUploader } from "@/components/property/form/media/FloorplanUploader";
import { FeaturedImagesSelector } from "@/components/property/form/media/FeaturedImagesSelector";
import { VirtualToursTab } from "@/components/property/form/media/VirtualToursTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageDatabaseFetcher } from "@/components/property/form/media/ImageDatabaseFetcher";
import { FloorplanDatabaseFetcher } from "@/components/property/form/media/FloorplanDatabaseFetcher";
import { convertToPropertyImageArray } from "@/utils/imageTypeConverters";
import { getImageUrl } from "@/utils/imageTypeConverters";

interface MediaTabContentProps {
  property: PropertyData;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage?: (index: number) => void;
  isUploading?: boolean;
  handleFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveFloorplan?: (index: number) => void;
  isUploadingFloorplan?: boolean;
  handleSetFeaturedImage?: (url: string | null) => void;
  handleToggleFeaturedImage?: (url: string) => void;
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (scriptContent: string) => void;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  floorplanEmbedScript?: string;
  handlers?: {
    handleVirtualTourUpdate: (url: string) => void;
    handleYoutubeUrlUpdate: (url: string) => void;
    handleFloorplanEmbedScriptUpdate: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  };
}

export function MediaTabContent({
  property,
  handleImageUpload = async () => {},
  handleRemoveImage = () => {},
  isUploading = false,
  handleFloorplanUpload = async () => {},
  handleRemoveFloorplan = () => {},
  isUploadingFloorplan = false,
  handleSetFeaturedImage = () => {},
  handleToggleFeaturedImage = () => {},
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  virtualTourUrl = '',
  youtubeUrl = '',
  floorplanEmbedScript = '',
  handlers
}: MediaTabContentProps) {
  const [activeTab, setActiveTab] = useState("images");
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [floorplans, setFloorplans] = useState<PropertyFloorplan[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(property.featuredImage);
  const [featuredImages, setFeaturedImages] = useState<string[]>(
    property.featuredImages && Array.isArray(property.featuredImages) 
      ? property.featuredImages.map(img => typeof img === 'string' ? img : img.url)
      : []
  );

  // Use handlers if provided, otherwise use props
  const virtualTourUpdateHandler = handlers?.handleVirtualTourUpdate || handleVirtualTourUpdate || (() => {});
  const youtubeUrlUpdateHandler = handlers?.handleYoutubeUrlUpdate || handleYoutubeUrlUpdate || (() => {});
  const floorplanEmbedScriptUpdateHandler = handlers?.handleFloorplanEmbedScriptUpdate || handleFloorplanEmbedScriptUpdate || (() => {});
  
  console.log("MediaTabContent - Updated with property:", {
    id: property.id,
    imagesCount: (property.images || []).length,
    floorplans: (property.floorplans || []).length,
    virtualTourUrl,
    youtubeUrl
  });
  
  // Handle image updates from database fetcher
  const handleImagesUpdate = (newImages: PropertyImage[]) => {
    console.log("MediaTabContent - Received images from DB:", newImages.length);
    setImages(newImages);
  };

  // Handle floorplan updates from database fetcher
  const handleFloorplansUpdate = (newFloorplans: PropertyFloorplan[]) => {
    console.log("MediaTabContent - Received floorplans from DB:", newFloorplans.length);
    setFloorplans(newFloorplans);
  };

  // Handle setting the featured image
  const handleFeatureImage = (url: string | null) => {
    setFeaturedImage(url);
    handleSetFeaturedImage(url);
    if (handlers?.setPendingChanges) {
      handlers.setPendingChanges(true);
    }
  };

  // Handle toggling a featured image
  const handleToggleFeature = (url: string) => {
    const newFeaturedImages = featuredImages.includes(url)
      ? featuredImages.filter(img => img !== url)
      : [...featuredImages, url];
    
    setFeaturedImages(newFeaturedImages);
    handleToggleFeaturedImage(url);
    if (handlers?.setPendingChanges) {
      handlers.setPendingChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="floorplans">Floorplans</TabsTrigger>
          <TabsTrigger value="virtualTours">Virtual Tours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-6">
          <ImageDatabaseFetcher 
            propertyId={property.id} 
            onImagesUpdate={handleImagesUpdate} 
          />
          
          <ImageUploader
            images={images}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
            isUploading={isUploading}
          />
          
          <FeaturedImagesSelector
            images={images}
            featuredImage={featuredImage}
            featuredImages={featuredImages}
            onFeatureImage={handleFeatureImage}
            onToggleFeature={handleToggleFeature}
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="space-y-6">
          <FloorplanDatabaseFetcher
            propertyId={property.id}
            onFloorplansUpdate={handleFloorplansUpdate}
          />
          
          <FloorplanUploader
            floorplans={floorplans}
            onUpload={handleFloorplanUpload}
            onRemove={handleRemoveFloorplan}
            isUploading={isUploadingFloorplan}
            embedScript={floorplanEmbedScript}
            onEmbedScriptUpdate={floorplanEmbedScriptUpdateHandler}
          />
        </TabsContent>
        
        <TabsContent value="virtualTours" className="space-y-6">
          <VirtualToursTab
            virtualTourUrl={virtualTourUrl}
            youtubeUrl={youtubeUrl}
            onVirtualTourUpdate={virtualTourUpdateHandler}
            onYoutubeUrlUpdate={youtubeUrlUpdateHandler}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
