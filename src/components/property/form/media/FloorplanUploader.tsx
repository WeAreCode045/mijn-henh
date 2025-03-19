
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyFloorplan } from "@/types/property";
import { ImagePreview } from "@/components/ImagePreview";
import { Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FloorplanUploaderProps {
  floorplans: PropertyFloorplan[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  isUploading?: boolean;
  embedScript?: string;
  onEmbedScriptUpdate: (script: string) => void;
}

export function FloorplanUploader({
  floorplans,
  onUpload,
  onRemove,
  isUploading = false,
  embedScript = "",
  onEmbedScriptUpdate
}: FloorplanUploaderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor Plans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {floorplans && floorplans.length > 0 ? (
            floorplans.map((floorplan, index) => (
              <div 
                key={floorplan.id || `floorplan-${index}`} 
                className="relative rounded-md overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <ImagePreview
                  src={floorplan.url}
                  alt={floorplan.title || `Floor plan ${index + 1}`}
                  className="w-full h-40 object-contain bg-muted"
                />
                {hoveredIndex === index && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-muted-foreground p-8 bg-muted rounded-md">
              No floor plans uploaded
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('floorplan-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Floor Plans'}
          </Button>
          <input
            type="file"
            id="floorplan-upload"
            className="hidden"
            onChange={onUpload}
            accept="image/*"
            multiple
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floorplan-embed">3D Floor Plan Embed Code</Label>
          <Textarea
            id="floorplan-embed"
            placeholder="Paste embed code from Matterport, etc."
            className="min-h-[100px]"
            value={embedScript}
            onChange={(e) => onEmbedScriptUpdate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Paste the embed code from your 3D floor plan provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
