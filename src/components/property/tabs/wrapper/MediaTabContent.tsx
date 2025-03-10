
import { PropertyMediaTab } from "../PropertyMediaTab";
import { PropertyImage } from "@/types/property";

interface MediaTabContentProps {
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
  floorplanEmbedScript,
  floorplans,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onFloorplanEmbedScriptUpdate,
  onImageUpload,
  onRemoveImage,
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading,
  isUploadingFloorplan,
  onUpload,
  featuredImageUrl,
  featuredImageUrls,
  onSetFeatured,
  onToggleFeatured,
}: MediaTabContentProps) {
  // Use aliases if provided, fall back to original props
  const effectiveImageUpload = onUpload || onImageUpload;
  
  console.log("MediaTabContent: floorplanEmbedScript =", floorplanEmbedScript);

  return (
    <PropertyMediaTab
      id={id}
      title={title}
      images={images}
      virtualTourUrl={virtualTourUrl}
      youtubeUrl={youtubeUrl}
      floorplanEmbedScript={floorplanEmbedScript}
      floorplans={floorplans}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onFloorplanEmbedScriptUpdate={onFloorplanEmbedScriptUpdate}
      onImageUpload={effectiveImageUpload}
      onRemoveImage={onRemoveImage}
      onFloorplanUpload={onFloorplanUpload}
      onRemoveFloorplan={onRemoveFloorplan}
      isUploading={isUploading}
      isUploadingFloorplan={isUploadingFloorplan}
      featuredImageUrl={featuredImageUrl}
      featuredImageUrls={featuredImageUrls}
      onSetFeatured={onSetFeatured}
      onToggleFeatured={onToggleFeatured}
    />
  );
}
