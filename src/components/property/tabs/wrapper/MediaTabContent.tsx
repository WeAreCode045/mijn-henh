
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
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onNotesUpdate?: (notes: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeaturedImage?: (imageUrl: string) => void;
  onToggleGridImage?: (imageUrl: string) => void;
  isUploading?: boolean;
  // Add onFeaturedImageSelect and onGridImageToggle as aliases
  onFeaturedImageSelect?: (imageUrl: string) => void;
  onGridImageToggle?: (imageUrl: string) => void;
  // Add onUpload as an alias for onImageUpload
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
  onImageUpload,
  onRemoveImage,
  onSetFeaturedImage,
  onToggleGridImage,
  isUploading,
  onFeaturedImageSelect,
  onGridImageToggle,
  onUpload,
}: MediaTabContentProps) {
  // Use aliases if provided, fall back to original props
  const effectiveImageUpload = onUpload || onImageUpload;
  const effectiveSetFeaturedImage = onFeaturedImageSelect || onSetFeaturedImage;
  const effectiveToggleGridImage = onGridImageToggle || onToggleGridImage;

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
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onNotesUpdate={onNotesUpdate}
      onImageUpload={effectiveImageUpload}
      onRemoveImage={onRemoveImage}
      onSetFeaturedImage={effectiveSetFeaturedImage}
      onToggleGridImage={effectiveToggleGridImage}
      isUploading={isUploading}
    />
  );
}
