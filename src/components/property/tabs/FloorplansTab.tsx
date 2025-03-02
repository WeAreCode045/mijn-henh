
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFloorplan } from "@/types/property";
import { FloorplanProcessor } from "./media/floorplans/FloorplanProcessor";
import { FloorplanGrid } from "./media/floorplans/FloorplanGrid";
import { FloorplanUploader } from "./media/floorplans/FloorplanUploader";
import { FloorplanEmbed } from "./media/floorplans/FloorplanEmbed";
import { FloorplanDatabaseFetcher } from "./media/floorplans/FloorplanDatabaseFetcher";
import { useState } from "react";

interface FloorplansTabProps {
  id: string;
  floorplans?: PropertyFloorplan[] | string[] | any[];
  floorplanEmbedScript?: string;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onFloorplanEmbedScriptUpdate?: (script: string) => void;
  isUploading?: boolean;
}

export function FloorplansTab({
  id,
  floorplans = [],
  floorplanEmbedScript = "",
  onFloorplanUpload,
  onRemoveFloorplan,
  onFloorplanEmbedScriptUpdate,
  isUploading = false,
}: FloorplansTabProps) {
  const [parsedFloorplans, setParsedFloorplans] = useState<PropertyFloorplan[]>([]);
  const [floorplansKey, setFloorplansKey] = useState(Date.now());

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFloorplanUpload) {
      try {
        onFloorplanUpload(e);
      } finally {
        // No need to set loading state here as it's handled by the parent
      }
    }
  };

  const handleEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onFloorplanEmbedScriptUpdate) {
      onFloorplanEmbedScriptUpdate(e.target.value);
    }
  };

  const handleFloorplansProcessed = (processed: PropertyFloorplan[]) => {
    setParsedFloorplans(processed);
    setFloorplansKey(Date.now()); // Update key to force re-render
  };

  const handleDatabaseFloorplansFetched = (dbFloorplans: PropertyFloorplan[]) => {
    setParsedFloorplans(prevFloorplans => {
      // Merge with any existing floorplans, avoiding duplicates by URL
      const existingUrls = prevFloorplans.map(f => f.url);
      const newFloorplans = dbFloorplans.filter(f => !existingUrls.includes(f.url));
      return [...prevFloorplans, ...newFloorplans];
    });
    setFloorplansKey(Date.now()); // Force re-render
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Property Floorplans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hidden processor components that handle data transformation */}
          <FloorplanProcessor 
            floorplans={floorplans} 
            propertyId={id}
            onProcessed={handleFloorplansProcessed} 
          />
          
          <FloorplanDatabaseFetcher
            propertyId={id}
            floorplans={parsedFloorplans}
            onFetchComplete={handleDatabaseFloorplansFetched}
          />

          {/* Visible UI components */}
          <FloorplanUploader isLoading={isUploading} onUpload={handleUpload} />
          
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
    </div>
  );
}
