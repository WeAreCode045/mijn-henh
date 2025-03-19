
import React, { useEffect } from "react";
import { PropertyData } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyImagesCard } from "./PropertyImagesCard";
import { FloorplansTab } from "./tabs/FloorplansTab";
import { VirtualToursTab } from "./tabs/VirtualToursTab";
import { usePropertyMediaHandlers } from "@/hooks/property/usePropertyMediaHandlers";
import { convertToPropertyImageArray } from "@/utils/propertyDataAdapters";
import { extractImageUrls } from "@/utils/imageTypeConverters";
import { MediaDatabaseFetcher } from "./MediaDatabaseFetcher";

interface MediaTabContentProps {
  property: PropertyData;
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  };
}

export function MediaTabContent({ property, handlers }: MediaTabContentProps) {
  const [activeTab, setActiveTab] = React.useState("images");
  const [localProperty, setLocalProperty] = React.useState<PropertyData>(property);
  const [isSaving, setIsSaving] = React.useState(false);

  // Update localProperty when property changes
  useEffect(() => {
    setLocalProperty(prev => ({
      ...prev,
      ...property,
    }));
    console.log("MediaTabContent - Updated with property:", property);
  }, [property]);

  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload,
    handleVirtualTourSave,
    handleYoutubeUrlSave,
    handleFloorplanEmbedScriptSave
  } = usePropertyMediaHandlers(localProperty, setLocalProperty, setIsSaving, handlers);

  // Function to handle database images fetch completion
  const handleImagesFromDatabase = (dbImages: any[]) => {
    if (dbImages && dbImages.length > 0) {
      console.log("MediaTabContent - Received images from DB:", dbImages);
      
      // Find the main image
      const mainImage = dbImages.find(img => img.is_main)?.url || null;
      
      // Find featured images
      const featuredImagesList = dbImages
        .filter(img => img.is_featured_image)
        .map(img => img.url);
      
      const updatedProperty = {
        ...localProperty,
        images: dbImages,
        featuredImage: mainImage,
        featuredImages: featuredImagesList
      };
      setLocalProperty(updatedProperty);
    }
  };

  // Process images for display
  const images = convertToPropertyImageArray(localProperty.images || []);
  const featuredImages = convertToPropertyImageArray(localProperty.featuredImages || []);
  const floorplans = convertToPropertyImageArray(localProperty.floorplans || []);

  // Extract URLs from featured images for components that expect string arrays
  const featuredImageUrls = extractImageUrls(featuredImages);

  console.log("MediaTabContent - Current property data:", {
    id: localProperty.id,
    imageCount: images.length,
    floorplanCount: floorplans.length,
    virtualTourUrl: localProperty.virtualTourUrl,
    youtubeUrl: localProperty.youtubeUrl,
    floorplanEmbedScript: localProperty.floorplanEmbedScript ? localProperty.floorplanEmbedScript.substring(0, 20) + '...' : 'none'
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Media</h2>
      
      {/* Fetch images from database */}
      <MediaDatabaseFetcher 
        propertyId={localProperty.id} 
        images={images}
        onFetchComplete={handleImagesFromDatabase}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="floorplans">Floorplans</TabsTrigger>
          <TabsTrigger value="virtual-tours">Virtual Tours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-6">
          <PropertyImagesCard 
            images={images} 
            onImageUpload={handleImageUpload} 
            onRemoveImage={handleRemoveImage} 
            isUploading={isSaving}
            featuredImage={localProperty.featuredImage}
            featuredImages={featuredImageUrls}
            onSetFeaturedImage={handleSetFeaturedImage}
            onToggleFeaturedImage={handleToggleFeaturedImage}
            propertyId={localProperty.id}
          />
        </TabsContent>
        
        <TabsContent value="floorplans" className="space-y-6">
          <FloorplansTab 
            property={localProperty} 
            setProperty={setLocalProperty} 
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        </TabsContent>
        
        <TabsContent value="virtual-tours" className="space-y-6">
          <VirtualToursTab 
            property={localProperty} 
            setProperty={setLocalProperty}
            onVirtualTourSave={handleVirtualTourSave}
            onYoutubeUrlSave={handleYoutubeUrlSave}
            onFloorplanEmbedScriptSave={handleFloorplanEmbedScriptSave}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
