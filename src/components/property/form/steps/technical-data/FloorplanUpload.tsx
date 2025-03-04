
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon, Trash2Icon, Settings } from "lucide-react";
import { PropertyFloorplan } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FloorplanUploadProps {
  floorplans: PropertyFloorplan[];
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
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
                      <Label htmlFor={`floorplan-columns-${index}`}>Columns</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id={`floorplan-columns-${index}`}
                          type="number"
                          min="1"
                          max="3"
                          value={floorplan.columns || 1}
                          onChange={(e) => onUpdateFloorplan?.(index, 'columns', parseInt(e.target.value) || 1)}
                          className="max-w-20"
                        />
                        <Settings className="w-4 h-4 text-gray-400" />
                      </div>
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
