
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VirtualTourCardProps {
  id: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  floorplanEmbedScript?: string;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onFloorplanEmbedScriptUpdate?: (script: string) => void;
}

export function VirtualTourCard({
  id,
  virtualTourUrl = "",
  youtubeUrl = "",
  floorplanEmbedScript = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onFloorplanEmbedScriptUpdate
}: VirtualTourCardProps) {
  const [localVirtualTourUrl, setLocalVirtualTourUrl] = useState(virtualTourUrl);
  const [localYoutubeUrl, setLocalYoutubeUrl] = useState(youtubeUrl);
  const [localFloorplanEmbed, setLocalFloorplanEmbed] = useState(floorplanEmbedScript);
  
  // Update local state when props change
  useEffect(() => {
    setLocalVirtualTourUrl(virtualTourUrl);
  }, [virtualTourUrl]);

  useEffect(() => {
    setLocalYoutubeUrl(youtubeUrl);
  }, [youtubeUrl]);

  useEffect(() => {
    setLocalFloorplanEmbed(floorplanEmbedScript);
  }, [floorplanEmbedScript]);

  const handleVirtualTourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLocalVirtualTourUrl(newUrl);
    if (onVirtualTourUpdate) {
      onVirtualTourUpdate(newUrl);
    }
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLocalYoutubeUrl(newUrl);
    if (onYoutubeUrlUpdate) {
      onYoutubeUrlUpdate(newUrl);
    }
  };

  const handleFloorplanEmbedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value;
    setLocalFloorplanEmbed(newScript);
    if (onFloorplanEmbedScriptUpdate) {
      console.log("Updating floorplan embed script:", newScript);
      onFloorplanEmbedScriptUpdate(newScript);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Virtual Tour & Video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`virtual-tour-${id}`}>Virtual Tour URL</Label>
          <Input
            id={`virtual-tour-${id}`}
            placeholder="https://my-virtual-tour.com/property123"
            value={localVirtualTourUrl}
            onChange={handleVirtualTourChange}
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL for your Matterport or other virtual tour
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`youtube-${id}`}>YouTube Video URL</Label>
          <Input
            id={`youtube-${id}`}
            placeholder="https://www.youtube.com/watch?v=abcdefg"
            value={localYoutubeUrl}
            onChange={handleYoutubeUrlChange}
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL of a YouTube video for this property
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`floorplan-embed-${id}`}>Floorplan Embed Script</Label>
          <Textarea
            id={`floorplan-embed-${id}`}
            placeholder="<iframe src='...' width='100%' height='500' frameborder='0'></iframe>"
            className="min-h-[120px] font-mono text-sm"
            value={localFloorplanEmbed}
            onChange={handleFloorplanEmbedChange}
          />
          <p className="text-xs text-muted-foreground">
            Paste the iframe embed code for an interactive floorplan
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
