
import { PropertyImage } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { VirtualTourCard } from "./media/VirtualTourCard";
import { MediaDatabaseFetcher } from "./media/MediaDatabaseFetcher";
import { useState } from "react";

interface PropertyMediaTabProps {
  id: string;
  title: string;
  images: PropertyImage[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onNotesUpdate?: (notes: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  isUploading?: boolean;
  // Add new properties for featured and grid images
  featuredImageUrl?: string | null;
  gridImageUrls?: string[];
  onSetFeatured?: (url: string) => void;
  onToggleGrid?: (url: string) => void;
}

export function PropertyMediaTab({
  id,
  title,
  images = [],
  virtualTourUrl = "",
  youtubeUrl = "",
  notes = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
  onImageUpload,
  onRemoveImage,
  isUploading = false,
  featuredImageUrl,
  gridImageUrls = [],
  onSetFeatured,
  onToggleGrid,
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
        gridImageUrls={gridImageUrls}
        onSetFeatured={onSetFeatured}
        onToggleGrid={onToggleGrid}
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
