
import { PropertyImage } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { VirtualTourCard } from "./media/VirtualTourCard";
import { MediaDatabaseFetcher } from "./media/MediaDatabaseFetcher";
import { FloorplansCard } from "./media/FloorplansCard";
import { useState, useEffect } from "react";

interface PropertyMediaTabProps {
  id: string;
  title: string;
  images: PropertyImage[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  floorplanEmbedScript?: string;
  floorplans?: any[];
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onFloorplanEmbedScriptUpdate?: (script: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  isUploading?: boolean;
  isUploadingFloorplan?: boolean;
  // Updated properties for main and featured images
  featuredImageUrl?: string | null;
  featuredImageUrls?: string[];
  onSetFeatured?: (url: string) => void;
  onToggleFeatured?: (url: string) => void;
}

export function PropertyMediaTab({
  id,
  title,
  images = [],
  virtualTourUrl = "",
  youtubeUrl = "",
  floorplanEmbedScript = "",
  floorplans = [],
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onFloorplanEmbedScriptUpdate,
  onImageUpload,
  onRemoveImage,
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading = false,
  isUploadingFloorplan = false,
  featuredImageUrl,
  featuredImageUrls = [],
  onSetFeatured,
  onToggleFeatured,
}: PropertyMediaTabProps) {
  const [mediaImages, setMediaImages] = useState<PropertyImage[]>(images);
  
  console.log("PropertyMediaTab: floorplanEmbedScript =", floorplanEmbedScript);
  console.log("PropertyMediaTab: featuredImageUrl =", featuredImageUrl);
  console.log("PropertyMediaTab: featuredImageUrls =", featuredImageUrls);

  const handleFetchComplete = (fetchedImages: PropertyImage[]) => {
    // Sort images if they come with sort_order values
    const sortedImages = [...fetchedImages].sort((a, b) => {
      // Use sort_order as primary sort criteria
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order;
      }
      // Fall back to using array order if sort_order is not available
      return 0;
    });
    
    console.log("PropertyMediaTab - Received sorted images:", sortedImages);
    setMediaImages(sortedImages);
  };

  // Update mediaImages when images prop changes
  useEffect(() => {
    if (images && images.length > 0) {
      // This ensures we update our state when parent component updates images
      // Apply the same sorting logic
      const sortedImages = [...images].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      
      setMediaImages(sortedImages);
    }
  }, [images]);

  return (
    <div className="space-y-6">
      {/* Hidden database fetcher component */}
      <MediaDatabaseFetcher
        propertyId={id}
        images={images}
        onFetchComplete={handleFetchComplete}
      />

      <PropertyImagesCard 
        images={mediaImages || images}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        isUploading={isUploading}
        featuredImageUrl={featuredImageUrl}
        featuredImageUrls={featuredImageUrls}
        onSetFeatured={onSetFeatured}
        onToggleFeatured={onToggleFeatured}
        propertyId={id}
      />

      <FloorplansCard
        id={id}
        floorplans={floorplans}
        onFloorplanUpload={onFloorplanUpload}
        onRemoveFloorplan={onRemoveFloorplan}
        isUploading={isUploadingFloorplan}
      />

      <VirtualTourCard 
        id={id}
        virtualTourUrl={virtualTourUrl}
        youtubeUrl={youtubeUrl}
        floorplanEmbedScript={floorplanEmbedScript}
        onVirtualTourUpdate={onVirtualTourUpdate}
        onYoutubeUrlUpdate={onYoutubeUrlUpdate}
        onFloorplanEmbedScriptUpdate={onFloorplanEmbedScriptUpdate}
      />
    </div>
  );
}
