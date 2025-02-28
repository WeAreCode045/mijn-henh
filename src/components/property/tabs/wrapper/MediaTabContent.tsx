
import { PropertyMediaTab } from "../PropertyMediaTab";
import { PropertyImage, PropertyFloorplan } from "@/types/property";

interface MediaTabContentProps {
  id: string;
  title: string;
  images: PropertyImage[];
  featuredImage: string | null;
  gridImages: string[];
  floorplans: PropertyFloorplan[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onFeaturedImageSelect: (url: string) => void;
  onGridImageToggle: (url: string) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanRemove: (index: number) => void;
  onFloorplanUpdate?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
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
  floorplans,
  virtualTourUrl,
  youtubeUrl,
  onUpload,
  onRemove,
  onFeaturedImageSelect,
  onGridImageToggle,
  onFloorplanUpload,
  onFloorplanRemove,
  onFloorplanUpdate,
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
      floorplans={floorplans || []}
      virtualTourUrl={virtualTourUrl}
      youtubeUrl={youtubeUrl}
      onUpload={onUpload}
      onRemove={onRemove}
      onFeaturedImageSelect={onFeaturedImageSelect}
      onGridImageToggle={onGridImageToggle}
      onFloorplanUpload={onFloorplanUpload}
      onFloorplanRemove={onFloorplanRemove}
      onFloorplanUpdate={onFloorplanUpdate}
      onVirtualTourUpdate={onVirtualTourUpdate}
      onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      onImageUpload={onImageUpload}
      onRemoveImage={onRemoveImage}
    />
  );
}
