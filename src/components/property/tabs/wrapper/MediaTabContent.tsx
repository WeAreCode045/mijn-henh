
import { PropertyMediaTab } from "../PropertyMediaTab";
import { FloorplansTab } from "../FloorplansTab";
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
  // Add activeSubTab to determine which tab to show
  activeSubTab?: 'media' | 'floorplans';
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
  activeSubTab = 'media',
}: MediaTabContentProps) {
  // Use aliases if provided, fall back to original props
  const effectiveImageUpload = onUpload || onImageUpload;
  const effectiveSetFeaturedImage = onFeaturedImageSelect || onSetFeaturedImage;
  const effectiveToggleGridImage = onGridImageToggle || onToggleGridImage;

  // Render either media or floorplans tab based on activeSubTab
  if (activeSubTab === 'floorplans') {
    return (
      <FloorplansTab
        id={id}
        floorplans={floorplans}
        floorplanEmbedScript={floorplanEmbedScript}
        onFloorplanUpload={onFloorplanUpload}
        onRemoveFloorplan={onRemoveFloorplan}
        onFloorplanEmbedScriptUpdate={onFloorplanEmbedScriptUpdate}
        isUploading={isUploading}
      />
    );
  } 
  
  // Default to media tab
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
