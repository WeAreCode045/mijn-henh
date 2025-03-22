import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  isReadOnly?: boolean;
}

export function FloorplansTab({
  property,
  setProperty,
  isSaving,
  setIsSaving,
  isReadOnly = false
}: FloorplansTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Floorplans</CardTitle>
        <CardDescription>
          Upload and manage floorplan images for this property
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isReadOnly ? (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
            Floorplan editing is disabled while the property is archived
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Floorplan management functionality here
          </div>
        )}
      </CardContent>
    </Card>
  );
}
