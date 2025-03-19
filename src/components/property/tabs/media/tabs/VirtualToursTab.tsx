
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  onVirtualTourSave?: (url: string) => Promise<void>;
  onYoutubeUrlSave?: (url: string) => Promise<void>;
  onFloorplanEmbedScriptSave?: (script: string) => Promise<void>;
  isSaving?: boolean;
}

export function VirtualToursTab({ 
  property, 
  setProperty,
  onVirtualTourSave,
  onYoutubeUrlSave,
  onFloorplanEmbedScriptSave,
  isSaving = false
}: VirtualToursTabProps) {
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtualTourUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(property.youtubeUrl || '');
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState(property.floorplanEmbedScript || '');

  // Update state when property changes
  React.useEffect(() => {
    setVirtualTourUrl(property.virtualTourUrl || '');
    setYoutubeUrl(property.youtubeUrl || '');
    setFloorplanEmbedScript(property.floorplanEmbedScript || '');
  }, [property]);

  const handleVirtualTourSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onVirtualTourSave) {
      await onVirtualTourSave(virtualTourUrl);
    }
  };

  const handleYoutubeUrlSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onYoutubeUrlSave) {
      await onYoutubeUrlSave(youtubeUrl);
    }
  };

  const handleFloorplanEmbedScriptSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onFloorplanEmbedScriptSave) {
      await onFloorplanEmbedScriptSave(floorplanEmbedScript);
    }
  };

  return (
    <div className="space-y-6">
      {/* Virtual Tour URL Card */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Tour URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
            <div className="flex gap-2">
              <Input 
                id="virtualTourUrl" 
                value={virtualTourUrl} 
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                placeholder="https://example.com/virtual-tour"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleVirtualTourSave}
                disabled={isSaving}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YouTube URL Card */}
      <Card>
        <CardHeader>
          <CardTitle>YouTube URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <div className="flex gap-2">
              <Input 
                id="youtubeUrl" 
                value={youtubeUrl} 
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleYoutubeUrlSave}
                disabled={isSaving}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floorplan Embed Script Card */}
      <Card>
        <CardHeader>
          <CardTitle>Floorplan Embed Script</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="floorplanEmbedScript">Embed Script</Label>
            <Textarea 
              id="floorplanEmbedScript" 
              value={floorplanEmbedScript} 
              onChange={(e) => setFloorplanEmbedScript(e.target.value)}
              placeholder="<iframe src='...'></iframe>"
              rows={5}
            />
            <Button 
              type="button" 
              onClick={handleFloorplanEmbedScriptSave}
              disabled={isSaving}
              className="w-fit"
            >
              Save Script
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
