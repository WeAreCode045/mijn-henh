
import { PropertyMediaTab } from "../PropertyMediaTab";
import { PropertyImage } from "@/types/property";

interface MediaTabContentProps {
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
  // Add onUpload as an alias for onImageUpload
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Add new properties for featured and grid images
  featuredImageUrl?: string | null;
  gridImageUrls?: string[];
  onSetFeatured?: (url: string) => void;
  onToggleGrid?: (url: string) => void;
}

export function MediaTabContent({
  id,
  title,
  images,
  virtualTourUrl,
  youtubeUrl,
  notes,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
  onImageUpload,
  onRemoveImage,
  isUploading,
  onUpload,
  featuredImageUrl,
  gridImageUrls,
  onSetFeatured,
  onToggleGrid,
}: MediaTabContentProps) {
  // Use aliases if provided, fall back to original props
  const effectiveImageUpload = onUpload || onImageUpload;

  return (
    <PropertyMediaTab
      id={id}
      title={title}
      images={images}
      virtualTourUrl={virtualTourUrl}
      youtubeUrl={youtubeUrl}
      notes={notes}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onNotesUpdate={onNotesUpdate}
      onImageUpload={effectiveImageUpload}
      onRemoveImage={onRemoveImage}
      isUploading={isUploading}
      featuredImageUrl={featuredImageUrl}
      gridImageUrls={gridImageUrls}
      onSetFeatured={onSetFeatured}
      onToggleGrid={onToggleGrid}
    />
  );
}
