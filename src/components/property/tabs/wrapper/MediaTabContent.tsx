
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
  floorplans?: any[];
  floorplanEmbedScript?: string;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onNotesUpdate?: (notes: string) => void;
  onFloorplanEmbedScriptUpdate?: (script: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
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
  floorplans,
  floorplanEmbedScript,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
  onFloorplanEmbedScriptUpdate,
  onImageUpload,
  onRemoveImage,
  onFloorplanUpload,
  onRemoveFloorplan,
  onSetFeaturedImage,
  onToggleGridImage,
  isUploading,
  onFeaturedImageSelect,
  onGridImageToggle,
  onUpload,
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
      floorplans={floorplans}
      floorplanEmbedScript={floorplanEmbedScript}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onNotesUpdate={onNotesUpdate}
      onFloorplanEmbedScriptUpdate={onFloorplanEmbedScriptUpdate}
      onImageUpload={onUpload || onImageUpload}
      onRemoveImage={onRemoveImage}
      onFloorplanUpload={onFloorplanUpload}
      onRemoveFloorplan={onRemoveFloorplan}
      onSetFeaturedImage={onFeaturedImageSelect || onSetFeaturedImage}
      onToggleGridImage={onGridImageToggle || onToggleGridImage}
      isUploading={isUploading}
    />
  );
}
