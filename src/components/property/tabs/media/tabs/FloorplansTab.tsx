
import React, { useState } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloorplanUploader } from "../floorplans/FloorplanUploader";
import { SortableFloorplanGrid } from "../floorplans/SortableFloorplanGrid";
import { FloorplanEmbed } from "../floorplans/FloorplanEmbed";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
}

export function FloorplansTab({ property, setProperty }: FloorplansTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFloorplanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation would go here
    console.log("Floorplan upload triggered");
  };
  
  const handleRemoveFloorplan = (index: number) => {
    // Implementation would go here
    console.log("Remove floorplan triggered for index:", index);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Floorplans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FloorplanUploader 
            onFloorplanUpload={handleFloorplanUpload} 
            isUploading={isUploading}
          />
          
          {property.floorplans && property.floorplans.length > 0 ? (
            <SortableFloorplanGrid 
              floorplans={property.floorplans} 
              propertyId={property.id}
              onRemoveFloorplan={handleRemoveFloorplan}
            />
          ) : (
            <p className="text-center text-muted-foreground">No floorplans uploaded yet.</p>
          )}
        </CardContent>
      </Card>
      
      {property.floorplanEmbedScript && (
        <Card>
          <CardHeader>
            <CardTitle>Floorplan Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <FloorplanEmbed script={property.floorplanEmbedScript} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
