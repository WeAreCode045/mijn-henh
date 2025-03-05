
import { PropertyImage } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { VirtualTourCard } from "./media/VirtualTourCard";
import { MediaDatabaseFetcher } from "./media/MediaDatabaseFetcher";
import { FloorplansCard } from "./media/FloorplansCard";
import { useState } from "react";

interface PropertyMediaTabProps {
  id: string;
  title: string;
  images: PropertyImage[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplans?: any[];
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onNotesUpdate?: (notes: string) => void;
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
  notes = "",
  floorplans = [],
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
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

  const handleFetchComplete = (fetchedImages: PropertyImage[]) => {
    setMediaImages(fetchedImages);
  };

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
        propertyId={id} // Pass propertyId to allow database updates
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
        notes={notes}
        onVirtualTourUpdate={onVirtualTourUpdate}
        onYoutubeUrlUpdate={onYoutubeUrlUpdate}
        onNotesUpdate={onNotesUpdate}
      />
    </div>
  );
}
