
import React from 'react';
import { PropertyData } from "@/types/property";

interface PropertyMediaTabProps {
  property: PropertyData;
  handlers: {
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveImage: (index: number) => void;
    handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFloorplan: (index: number) => void;
    handleSetFeaturedImage: (url: string | null) => void;
    handleToggleFeaturedImage: (url: string) => void;
    handleVirtualTourUpdate: (url: string) => void;
    handleYoutubeUrlUpdate: (url: string) => void;
    handleFloorplanEmbedScriptUpdate: (script: string) => void;
    isUploading: boolean;
    isUploadingFloorplan: boolean;
  };
}

export function PropertyMediaTab({ property, handlers }: PropertyMediaTabProps) {
  return (
    <div className="space-y-6">
      <h2>Media Tab Content</h2>
      <p>This component has been replaced with MediaTabContent in src/components/property/tabs/media/MediaTabContent.tsx</p>
    </div>
  );
}
