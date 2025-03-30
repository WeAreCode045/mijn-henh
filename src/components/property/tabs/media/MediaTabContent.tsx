
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { VirtualTourCard } from "./VirtualTourCard";

interface MediaTabContentProps {
  property: PropertyData;
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (script: string) => void;
  isReadOnly?: boolean;
}

export function MediaTabContent({ 
  property,
  handleVirtualTourUpdate,
  handleYoutubeUrlUpdate,
  handleFloorplanEmbedScriptUpdate,
  isReadOnly = false
}: MediaTabContentProps) {
  // Create default handlers if none are provided
  const onVirtualTourUpdate = handleVirtualTourUpdate || ((url: string) => {
    console.log("Virtual tour URL update not implemented:", url);
  });
  
  const onYoutubeUrlUpdate = handleYoutubeUrlUpdate || ((url: string) => {
    console.log("YouTube URL update not implemented:", url);
  });
  
  const onFloorplanEmbedScriptUpdate = handleFloorplanEmbedScriptUpdate || ((script: string) => {
    console.log("Floorplan embed script update not implemented:", script);
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Media</h2>
      
      <div className="grid gap-6">
        <VirtualTourCard
          virtualTourUrl={property.virtualTourUrl || ""}
          youtubeUrl={property.youtubeUrl || ""}
          onVirtualTourUpdate={onVirtualTourUpdate}
          onYoutubeUrlUpdate={onYoutubeUrlUpdate}
        />
        
        {/* Additional media cards can go here */}
        
        {property.floorplanEmbedScript && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Floorplan Embed</h3>
            <div className="bg-muted p-4 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
