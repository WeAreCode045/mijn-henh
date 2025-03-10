
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp } from "lucide-react";
import { SortableFloorplanGrid } from "../floorplans/SortableFloorplanGrid";
import { FloorplanUploader } from "../floorplans/FloorplanUploader";
import { FloorplanEmbed } from "../floorplans/FloorplanEmbed";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
}

export function FloorplansTab({ property, setProperty }: FloorplansTabProps) {
  const handleFloorplanEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProperty(prev => ({
      ...prev,
      floorplanEmbedScript: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileUp className="mr-2 h-5 w-5" />
            Floorplan Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FloorplanUploader property={property} />
          
          {property.floorplans && property.floorplans.length > 0 && (
            <div className="mt-6">
              <SortableFloorplanGrid
                floorplans={property.floorplans}
                propertyId={property.id}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Floorplan Embed</CardTitle>
        </CardHeader>
        <CardContent>
          <FloorplanEmbed 
            embedScript={property.floorplanEmbedScript || ''} 
            onChange={handleFloorplanEmbedScriptChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
