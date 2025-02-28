
import { PropertyImage } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { VirtualTourCard } from "./media/VirtualTourCard";

interface PropertyMediaTabProps {
  id: string;
  title: string;
  images: PropertyImage[];
  featuredImage: string | null;
  gridImages: string[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeaturedImage?: (imageUrl: string) => void;
  onToggleGridImage?: (imageUrl: string) => void;
  isUploading?: boolean;
}

export function PropertyMediaTab({
  id,
  title,
  images = [],
  featuredImage,
  gridImages = [],
  virtualTourUrl = "",
  youtubeUrl = "",
  notes = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onImageUpload,
  onRemoveImage,
  onSetFeaturedImage,
  onToggleGridImage,
  isUploading = false,
}: PropertyMediaTabProps) {
  return (
    <div className="space-y-6">
      <PropertyImagesCard 
        images={images}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        onSetFeaturedImage={onSetFeaturedImage}
        onToggleGridImage={onToggleGridImage}
        featuredImage={featuredImage}
        gridImages={gridImages}
        isUploading={isUploading}
      />

      <VirtualTourCard 
        id={id}
        virtualTourUrl={virtualTourUrl}
        youtubeUrl={youtubeUrl}
        notes={notes}
        onVirtualTourUpdate={onVirtualTourUpdate}
        onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      />
    </div>
  );
}
