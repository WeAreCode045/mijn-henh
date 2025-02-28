
import { PropertyMediaTab } from "../PropertyMediaTab";
import { PropertyImage } from "@/types/property";

interface MediaTabContentProps {
  id: string;
  title: string;
  images: PropertyImage[];
  featuredImage: string | null;
  gridImages: string[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onFeaturedImageSelect: (url: string) => void;
  onGridImageToggle: (url: string) => void;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function MediaTabContent({
  id,
  title,
  images,
  featuredImage,
  gridImages,
  virtualTourUrl,
  youtubeUrl,
  onUpload,
  onRemove,
  onFeaturedImageSelect,
  onGridImageToggle,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onImageUpload,
  onRemoveImage,
}: MediaTabContentProps) {
  return (
    <PropertyMediaTab 
      id={id}
      title={title || ""}
      images={images || []}
      featuredImage={featuredImage}
      gridImages={gridImages || []}
      virtualTourUrl={virtualTourUrl}
      youtubeUrl={youtubeUrl}
      onUpload={onUpload}
      onRemove={onRemove}
      onFeaturedImageSelect={onFeaturedImageSelect}
      onGridImageToggle={onGridImageToggle}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onImageUpload={onImageUpload}
      onRemoveImage={onRemoveImage}
    />
  );
}
