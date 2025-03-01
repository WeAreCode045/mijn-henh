
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VirtualTourCardProps {
  id: string;
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  floorplanEmbedScript?: string;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
  onNotesUpdate?: (notes: string) => void;
  onFloorplanEmbedScriptUpdate?: (script: string) => void;
}

export function VirtualTourCard({
  id,
  virtualTourUrl = "",
  youtubeUrl = "",
  notes = "",
  floorplanEmbedScript = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  onNotesUpdate,
  onFloorplanEmbedScriptUpdate
}: VirtualTourCardProps) {
  const [localVirtualTourUrl, setLocalVirtualTourUrl] = useState(virtualTourUrl);
  const [localYoutubeUrl, setLocalYoutubeUrl] = useState(youtubeUrl);
  const [localNotes, setLocalNotes] = useState(notes);
  
  useEffect(() => {
    setLocalVirtualTourUrl(virtualTourUrl);
  }, [virtualTourUrl]);

  useEffect(() => {
    setLocalYoutubeUrl(youtubeUrl);
  }, [youtubeUrl]);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

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

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    if (onNotesUpdate) {
      onNotesUpdate(newNotes);
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
          <Label htmlFor={`notes-${id}`}>Notes</Label>
          <Textarea
            id={`notes-${id}`}
            placeholder="Additional notes about the property..."
            className="min-h-[100px]"
            value={localNotes}
            onChange={handleNotesChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
