
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  onVirtualTourSave?: (url: string) => Promise<void>;
  onYoutubeUrlSave?: (url: string) => Promise<void>;
  onFloorplanEmbedScriptSave?: (script: string) => Promise<void>;
  preventFormSubmission?: (e: React.FormEvent) => false;
  isSaving?: boolean;
}

export function VirtualToursTab({ 
  property, 
  setProperty,
  onVirtualTourSave,
  onYoutubeUrlSave,
  onFloorplanEmbedScriptSave,
  preventFormSubmission,
  isSaving = false
}: VirtualToursTabProps) {
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtualTourUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(property.youtubeUrl || '');
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState(property.floorplanEmbedScript || '');

  const handleVirtualTourSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (onVirtualTourSave) {
      await onVirtualTourSave(virtualTourUrl);
    }
  };

  const handleYoutubeUrlSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (onYoutubeUrlSave) {
      await onYoutubeUrlSave(youtubeUrl);
    }
  };

  const handleFloorplanEmbedScriptSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (onFloorplanEmbedScriptSave) {
      await onFloorplanEmbedScriptSave(floorplanEmbedScript);
    }
  };

  return (
    <div className="space-y-6">
      {/* Virtual Tour URL */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Tour URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVirtualTourSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
              <Input
                id="virtualTourUrl"
                value={virtualTourUrl}
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                placeholder="Enter virtual tour URL"
              />
            </div>
            <Button type="button" onClick={handleVirtualTourSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Virtual Tour URL"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* YouTube URL */}
      <Card>
        <CardHeader>
          <CardTitle>YouTube Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleYoutubeUrlSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
              />
            </div>
            <Button type="button" onClick={handleYoutubeUrlSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save YouTube URL"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Floorplan Embed Script */}
      <Card>
        <CardHeader>
          <CardTitle>Floorplan Embed Script</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFloorplanEmbedScriptSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="floorplanEmbedScript">Embed Script</Label>
              <Textarea
                id="floorplanEmbedScript"
                value={floorplanEmbedScript}
                onChange={(e) => setFloorplanEmbedScript(e.target.value)}
                placeholder="Paste floorplan embed script here"
                rows={5}
              />
            </div>
            <Button type="button" onClick={handleFloorplanEmbedScriptSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Embed Script"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
