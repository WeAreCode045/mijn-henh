
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VirtualTourCard } from "../VirtualTourCard";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
}

export function VirtualToursTab({ property, setProperty }: VirtualToursTabProps) {
  const handleVirtualTourUpdate = (url: string) => {
    setProperty(prev => ({ ...prev, virtualTourUrl: url }));
  };
  
  const handleYoutubeUrlUpdate = (url: string) => {
    setProperty(prev => ({ ...prev, youtubeUrl: url }));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Virtual Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualTourCard 
            virtualTourUrl={property.virtualTourUrl}
            youtubeUrl={property.youtubeUrl}
            onVirtualTourUpdate={handleVirtualTourUpdate}
            onYoutubeUrlUpdate={handleYoutubeUrlUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
