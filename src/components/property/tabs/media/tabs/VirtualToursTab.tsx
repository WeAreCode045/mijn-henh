
import React, { useState, useEffect } from "react";
import { PropertyData } from "@/types/property";
import { VirtualTourCard } from "../VirtualTourCard";
import { usePropertyVirtualTourHandlers } from "@/hooks/property/media/usePropertyVirtualTourHandlers";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export function VirtualToursTab({
  property,
  setProperty,
  isSaving,
  setIsSaving
}: VirtualToursTabProps) {
  // Initialize with values from property to ensure they're loaded
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtualTourUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(property.youtubeUrl || "");
  
  // Update local state when property changes
  useEffect(() => {
    setVirtualTourUrl(property.virtualTourUrl || "");
    setYoutubeUrl(property.youtubeUrl || "");
    console.log("VirtualToursTab - Loaded URLs:", {
      virtualTourUrl: property.virtualTourUrl,
      youtubeUrl: property.youtubeUrl
    });
  }, [property]);
  
  // Get the handlers for updating tour URLs
  const { 
    handleVirtualTourSave, 
    handleYoutubeUrlSave 
  } = usePropertyVirtualTourHandlers(property, setProperty, setIsSaving);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Virtual Tours and Videos</h3>
      <VirtualTourCard
        id={property.id}
        virtualTourUrl={virtualTourUrl}
        youtubeUrl={youtubeUrl}
        onVirtualTourUpdate={handleVirtualTourSave}
        onYoutubeUrlUpdate={handleYoutubeUrlSave}
      />
    </div>
  );
}
