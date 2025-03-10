
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { Textarea } from "@/components/ui/textarea";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
}

export function FloorplansTab({ property, setProperty }: FloorplansTabProps) {
  const { 
    handleFloorplanUpload, 
    handleRemoveFloorplan, 
    isUploadingFloorplan 
  } = usePropertyFloorplans(property, setProperty);

  const handleEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProperty(prev => ({
      ...prev,
      floorplanEmbedScript: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
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
                disabled={isUploadingFloorplan}
              />
              <Button variant="outline" size="sm" disabled={isUploadingFloorplan}>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Floorplans
              </Button>
            </label>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!property.floorplans || property.floorplans.length === 0) ? (
            <div className="text-center py-12 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground mb-4">No floorplans uploaded yet</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFloorplanUpload}
                  disabled={isUploadingFloorplan}
                />
                <Button variant="secondary" disabled={isUploadingFloorplan}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Upload Floorplans
                </Button>
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {property.floorplans.map((floorplan, index) => {
                const imageUrl = typeof floorplan === 'string' ? floorplan : floorplan.url;
                
                return (
                  <div key={index} className="relative group border rounded-md overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Floorplan ${index + 1}`} 
                      className="w-full h-40 object-contain bg-gray-100"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFloorplan(index)}
                      >
                        <Trash2Icon className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Floorplan Embed Script</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste 3D floorplan embed script here..."
            className="min-h-[150px]"
            value={property.floorplanEmbedScript || ''}
            onChange={handleEmbedScriptChange}
          />
          <p className="text-sm text-muted-foreground mt-2">
            You can paste HTML embed code from Matterport, FloorPlanner, or other 3D floorplan services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
