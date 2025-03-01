
import { PropertyImage } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { VirtualTourCard } from "./media/VirtualTourCard";
import { FloorplansCard } from "./media/FloorplansCard";

interface PropertyMediaTabProps {
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
  floorplans = [],
  floorplanEmbedScript = "",
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

      <FloorplansCard
        floorplans={floorplans}
        floorplanEmbedScript={floorplanEmbedScript}
        onFloorplanUpload={onFloorplanUpload}
        onRemoveFloorplan={onRemoveFloorplan}
        onUpdateFloorplanEmbedScript={onFloorplanEmbedScriptUpdate}
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
