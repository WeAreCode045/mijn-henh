
import { PropertyImage, PropertyFloorplan } from "@/types/property";
import { PropertyImagesCard } from "./media/PropertyImagesCard";
import { FloorplansCard } from "./media/FloorplansCard";
import { VirtualTourCard } from "./media/VirtualTourCard";

interface PropertyMediaTabProps {
  id: string;
  title: string;
  images: PropertyImage[];
  floorplans: PropertyFloorplan[];
  featuredImage: string | null;
  gridImages: string[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void;
  onFeaturedImageSelect?: (imageUrl: string) => void;
  onGridImageToggle?: (imageUrl: string) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanRemove: (index: number) => void;
  onFloorplanUpdate?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function PropertyMediaTab({
  id,
  title,
  images = [],
  floorplans = [],
  featuredImage,
  gridImages = [],
  virtualTourUrl = "",
  youtubeUrl = "",
  notes = "",
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
}: PropertyMediaTabProps) {
  return (
    <div className="space-y-6">
      <PropertyImagesCard 
        images={images}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
      />

      <FloorplansCard 
        floorplans={floorplans}
        onFloorplanUpload={onFloorplanUpload}
        onFloorplanRemove={onFloorplanRemove}
        onFloorplanUpdate={onFloorplanUpdate}
      />

      <VirtualTourCard 
        id={id}
        virtualTourUrl={virtualTourUrl}
        youtubeUrl={youtubeUrl}
        notes={notes}
        onVirtualTourUpdate={onVirtualTourUpdate}
        onYoutubeUrlUpdate={onYoutubeUrlUpdate}
      />
    </div>
  );
}
