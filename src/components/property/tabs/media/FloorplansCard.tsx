
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFloorplan } from "@/types/property";
import { FloorplanProcessor } from "./floorplans/FloorplanProcessor";
import { FloorplanGrid } from "./floorplans/FloorplanGrid";
import { FloorplanUploader } from "./floorplans/FloorplanUploader";
import { FloorplanEmbed } from "./floorplans/FloorplanEmbed";
import { FloorplanDatabaseFetcher } from "./floorplans/FloorplanDatabaseFetcher";

interface FloorplansCardProps {
  floorplans: PropertyFloorplan[] | string[];
  floorplanEmbedScript?: string;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplanEmbedScript?: (script: string) => void;
  propertyId?: string; // Add property ID to fetch floorplans directly if needed
}

export function FloorplansCard({
  floorplans = [],
  floorplanEmbedScript = "",
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplanEmbedScript,
  propertyId,
}: FloorplansCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedFloorplans, setParsedFloorplans] = useState<PropertyFloorplan[]>([]);
  
  // Use a key to force re-render when floorplans array changes
  const [floorplansKey, setFloorplansKey] = useState(Date.now());

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFloorplanUpload) {
      setIsLoading(true);
      try {
        onFloorplanUpload(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdateFloorplanEmbedScript) {
      onUpdateFloorplanEmbedScript(e.target.value);
    }
  };

  const handleFloorplansProcessed = (processed: PropertyFloorplan[]) => {
    setParsedFloorplans(processed);
    setFloorplansKey(Date.now()); // Update key to force re-render
  };

  const handleDatabaseFloorplansFetched = (dbFloorplans: PropertyFloorplan[]) => {
    setParsedFloorplans(dbFloorplans);
    setFloorplansKey(Date.now()); // Force re-render
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Floorplans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden processor components that handle data transformation */}
        <FloorplanProcessor 
          floorplans={floorplans} 
          propertyId={propertyId}
          onProcessed={handleFloorplansProcessed} 
        />
        
        <FloorplanDatabaseFetcher
          propertyId={propertyId}
          floorplans={floorplans}
          onFetchComplete={handleDatabaseFloorplansFetched}
        />

        {/* Visible UI components */}
        <FloorplanUploader isLoading={isLoading} onUpload={handleUpload} />
        
        <FloorplanEmbed 
          embedScript={floorplanEmbedScript} 
          onChange={handleEmbedScriptChange} 
        />

        <FloorplanGrid 
          floorplans={parsedFloorplans} 
          gridKey={floorplansKey} 
          onRemoveFloorplan={onRemoveFloorplan} 
        />
      </CardContent>
    </Card>
  );
}
