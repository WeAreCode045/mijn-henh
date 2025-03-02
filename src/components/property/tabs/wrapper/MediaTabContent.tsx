
import { PropertyMediaTab } from "../PropertyMediaTab";
import { FloorplansTab } from "../FloorplansTab";
import { PropertyImage } from "@/types/property";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  // Use aliases if provided, fall back to original props
  const effectiveImageUpload = onUpload || onImageUpload;
  const effectiveSetFeaturedImage = onFeaturedImageSelect || onSetFeaturedImage;
  const effectiveToggleGridImage = onGridImageToggle || onToggleGridImage;
  
  // Add local state for the active media subtab
  const [activeMediaTab, setActiveMediaTab] = useState<string>("images");

  return (
    <Tabs defaultValue="images" value={activeMediaTab} onValueChange={setActiveMediaTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="floorplans">Floorplans</TabsTrigger>
      </TabsList>
      
      <TabsContent value="images">
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
      </TabsContent>
      
      <TabsContent value="floorplans">
        <FloorplansTab
          id={id}
          floorplans={floorplans}
          floorplanEmbedScript={floorplanEmbedScript}
          onFloorplanUpload={onFloorplanUpload}
          onRemoveFloorplan={onRemoveFloorplan}
          onFloorplanEmbedScriptUpdate={onFloorplanEmbedScriptUpdate}
          isUploading={isUploading}
        />
      </TabsContent>
    </Tabs>
  );
}
