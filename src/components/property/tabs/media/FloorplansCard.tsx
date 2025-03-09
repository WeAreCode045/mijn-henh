
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { PropertyImage } from "@/types/property";
import { SortableFloorplanGrid } from "./floorplans/SortableFloorplanGrid";

interface FloorplansCardProps {
  floorplans: PropertyImage[];
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan: (index: number) => void;
  isUploading: boolean;
  propertyId?: string;
}

export function FloorplansCard({ 
  floorplans, 
  onFloorplanUpload, 
  onRemoveFloorplan, 
  isUploading,
  propertyId = "" 
}: FloorplansCardProps) {
  // Convert event handler to match expected type
  const handleFloorplanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFloorplanUpload(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Floorplans</span>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFloorplanUpload}
              disabled={isUploading}
            />
            <Button variant="outline" size="sm" disabled={isUploading}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Floorplans
            </Button>
          </label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(!floorplans || floorplans.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No floorplans uploaded yet</p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFloorplanUpload}
                disabled={isUploading}
              />
              <Button variant="secondary" disabled={isUploading}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Floorplans
              </Button>
            </label>
          </div>
        ) : (
          <SortableFloorplanGrid 
            floorplans={floorplans} 
            onRemoveFloorplan={onRemoveFloorplan}
            propertyId={propertyId}
          />
        )}
      </CardContent>
    </Card>
  );
}
