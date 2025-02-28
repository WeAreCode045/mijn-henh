
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
  notes?: string;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void;
  onFeaturedImageSelect?: (imageUrl: string) => void;
  onGridImageToggle?: (imageUrl: string) => void;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  isUploading?: boolean;
}

export function MediaTabContent({
  id,
  title,
  images,
  featuredImage,
  gridImages,
  virtualTourUrl,
  youtubeUrl,
  notes,
  onUpload,
  onRemove,
  onFeaturedImageSelect,
  onGridImageToggle,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onImageUpload,
  onRemoveImage,
  isUploading,
}: MediaTabContentProps) {
  return (
    <PropertyMediaTab
      id={id}
      title={title}
      images={images}
      featuredImage={featuredImage}
      gridImages={gridImages}
      virtualTourUrl={virtualTourUrl}
      youtubeUrl={youtubeUrl}
      notes={notes}
      onUpload={onUpload}
      onRemove={onRemove}
      onFeaturedImageSelect={onFeaturedImageSelect}
      onGridImageToggle={onGridImageToggle}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onImageUpload={onImageUpload}
      onRemoveImage={onRemoveImage}
      isUploading={isUploading}
    />
  );
}
