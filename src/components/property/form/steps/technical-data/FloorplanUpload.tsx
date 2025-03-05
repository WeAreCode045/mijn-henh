
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Floorplan {
  id: string;
  url: string;
  title?: string;
}

interface FloorplanUploadProps {
  floorplans: Floorplan[];
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof Floorplan, value: any) => void;
  isUploading?: boolean;
}

export function FloorplanUpload({
  floorplans = [],
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan,
  isUploading = false,
}: FloorplanUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Floorplan Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <label htmlFor="floorplan-upload" className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isUploading}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Floorplan Images"}
            </Button>
            <input
              id="floorplan-upload"
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={onFloorplanUpload}
              disabled={isUploading}
            />
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {floorplans.length > 0 ? (
              floorplans.map((floorplan, index) => (
                <div key={floorplan.id || index} className="relative group border rounded-lg p-4">
                  <div className="aspect-video border rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={floorplan.url}
                      alt={`Floorplan ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div>
                      <Label htmlFor={`floorplan-title-${index}`}>Title</Label>
                      <Input
                        id={`floorplan-title-${index}`}
                        type="text"
                        value={floorplan.title || ''}
                        onChange={(e) => onUpdateFloorplan?.(index, 'title', e.target.value)}
                        placeholder="Floor plan title"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => onRemoveFloorplan?.(index)}
                    >
                      <Trash2Icon className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                No floorplan images uploaded yet. Click "Upload Floorplan Images" to add floorplans.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
