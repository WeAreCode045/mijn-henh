
import React, { useState } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FloorplanUploader } from "../floorplans/FloorplanUploader";
import { ImageIcon } from "lucide-react";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  isUploadingFloorplan?: boolean;
  onFloorplanEmbedScriptSave?: (script: string) => void;
  isReadOnly?: boolean;
}

export function FloorplansTab({
  property,
  setProperty,
  isSaving,
  setIsSaving,
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploadingFloorplan = false,
  onFloorplanEmbedScriptSave,
  isReadOnly = false
}: FloorplansTabProps) {
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState(property.floorplanEmbedScript || '');

  const handleSaveFloorplanEmbed = () => {
    if (onFloorplanEmbedScriptSave) {
      onFloorplanEmbedScriptSave(floorplanEmbedScript);
    }
  };

  // Helper function to safely get URL from either string or PropertyImage
  const getImageUrl = (image: PropertyImage | string): string => {
    if (typeof image === 'string') {
      return image;
    }
    return image.url;
  };

  return (
    <div className="space-y-6">
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
            <div className="space-y-6">
              {onFloorplanUpload && (
                <FloorplanUploader 
                  onFloorplanUpload={onFloorplanUpload} 
                  isUploading={isUploadingFloorplan} 
                />
              )}
              
              {property.floorplans && property.floorplans.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Uploaded Floorplans</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.floorplans.map((floorplan, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(floorplan)}
                          alt={`Floorplan ${index + 1}`}
                          className="w-full h-36 object-contain border rounded-md p-2"
                        />
                        {!isReadOnly && onRemoveFloorplan && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                            onClick={() => onRemoveFloorplan(index)}
                          >
                            <span className="sr-only">Remove</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                  <ImageIcon className="h-10 w-10 mb-2 text-gray-400" />
                  <p>No floorplans uploaded yet</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Floorplan Script */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Floorplan</CardTitle>
          <CardDescription>
            Add an embed script from a floorplan provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="floorplanEmbedScript">Embed Script</Label>
            <Textarea
              id="floorplanEmbedScript"
              placeholder="<iframe src=...>"
              value={floorplanEmbedScript}
              onChange={(e) => setFloorplanEmbedScript(e.target.value)}
              rows={6}
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveFloorplanEmbed} 
            disabled={isSaving || isReadOnly}
          >
            Save Embed Script
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
