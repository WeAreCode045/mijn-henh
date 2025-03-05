
import { PropertyMediaTab } from "../PropertyMediaTab";
import { PropertyImage } from "@/types/property";

interface MediaTabContentProps {
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
  // Add onUpload as an alias for onImageUpload
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Updated properties for main and featured images
  featuredImageUrl?: string | null;
  featuredImageUrls?: string[];
  onSetFeatured?: (url: string) => void;
  onToggleFeatured?: (url: string) => void;
}

export function MediaTabContent({
  id,
  title,
  images,
  virtualTourUrl,
  youtubeUrl,
  notes,
  floorplans,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
  onImageUpload,
  onRemoveImage,
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading,
  onUpload,
  featuredImageUrl,
  featuredImageUrls,
  onSetFeatured,
  onToggleFeatured,
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
      floorplans={floorplans}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onNotesUpdate={onNotesUpdate}
      onImageUpload={effectiveImageUpload}
      onRemoveImage={onRemoveImage}
      onFloorplanUpload={onFloorplanUpload}
      onRemoveFloorplan={onRemoveFloorplan}
      isUploading={isUploading}
      featuredImageUrl={featuredImageUrl}
      featuredImageUrls={featuredImageUrls}
      onSetFeatured={onSetFeatured}
      onToggleFeatured={onToggleFeatured}
    />
  );
}
