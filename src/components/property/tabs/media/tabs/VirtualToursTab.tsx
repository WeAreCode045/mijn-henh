
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  onVirtualTourSave?: (url: string) => void;
  onYoutubeUrlSave?: (url: string) => void;
  onFloorplanEmbedScriptSave?: (script: string) => void;
  isSaving: boolean;
  isReadOnly?: boolean;
}

export function VirtualToursTab({
  property,
  setProperty,
  onVirtualTourSave,
  onYoutubeUrlSave,
  onFloorplanEmbedScriptSave,
  isSaving,
  isReadOnly = false
}: VirtualToursTabProps) {
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtualTourUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(property.youtubeUrl || '');
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState(property.floorplanEmbedScript || '');

  const handleSaveVirtualTour = () => {
    if (onVirtualTourSave) {
      onVirtualTourSave(virtualTourUrl);
    }
  };

  const handleSaveYoutubeUrl = () => {
    if (onYoutubeUrlSave) {
      onYoutubeUrlSave(youtubeUrl);
    }
  };

  const handleSaveFloorplanEmbed = () => {
    if (onFloorplanEmbedScriptSave) {
      onFloorplanEmbedScriptSave(floorplanEmbedScript);
    }
  };

  return (
    <div className="space-y-6">
      {/* Virtual Tour URL Card */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Tour</CardTitle>
          <CardDescription>
            Add a virtual tour URL (Matterport, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
            <Input
              id="virtualTourUrl"
              placeholder="https://my.matterport.com/show/?m=..."
              value={virtualTourUrl}
              onChange={(e) => setVirtualTourUrl(e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveVirtualTour} 
            disabled={isSaving || isReadOnly}
          >
            Save Virtual Tour
          </Button>
        </CardFooter>
      </Card>

      {/* YouTube Video Card */}
      <Card>
        <CardHeader>
          <CardTitle>YouTube Video</CardTitle>
          <CardDescription>
            Add a YouTube video URL for the property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveYoutubeUrl} 
            disabled={isSaving || isReadOnly}
          >
            Save YouTube URL
          </Button>
        </CardFooter>
      </Card>

      {/* Floorplan Embed Script Card */}
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
