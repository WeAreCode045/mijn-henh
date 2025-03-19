
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface VirtualTourCardProps {
  id?: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  onVirtualTourUpdate: (url: string) => void;
  onYoutubeUrlUpdate: (url: string) => void;
}

export function VirtualTourCard({
  id = "",
  virtualTourUrl = "",
  youtubeUrl = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate
}: VirtualTourCardProps) {
  const [localVirtualTourUrl, setLocalVirtualTourUrl] = useState(virtualTourUrl);
  const [localYoutubeUrl, setLocalYoutubeUrl] = useState(youtubeUrl);

  // Update local state when props change
  useEffect(() => {
    setLocalVirtualTourUrl(virtualTourUrl);
    setLocalYoutubeUrl(youtubeUrl);
    console.log("VirtualTourCard - Received URLs:", { virtualTourUrl, youtubeUrl });
  }, [virtualTourUrl, youtubeUrl]);

  const handleVirtualTourSubmit = () => {
    onVirtualTourUpdate(localVirtualTourUrl);
  };

  const handleYoutubeUrlSubmit = () => {
    onYoutubeUrlUpdate(localYoutubeUrl);
  };

  // Fix YouTube URL for embedding if it's in watch format
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Matterport or other 3D Tour URL</h3>
          <div className="flex gap-2">
            <Input
              value={localVirtualTourUrl}
              onChange={(e) => setLocalVirtualTourUrl(e.target.value)}
              placeholder="Paste 3D tour embed URL here"
            />
            <Button onClick={handleVirtualTourSubmit}>Save</Button>
          </div>
          {virtualTourUrl && (
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={virtualTourUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title="Virtual Tour"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">YouTube Video URL</h3>
          <div className="flex gap-2">
            <Input
              value={localYoutubeUrl}
              onChange={(e) => setLocalYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube video URL here"
            />
            <Button onClick={handleYoutubeUrlSubmit}>Save</Button>
          </div>
          {youtubeUrl && (
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={getEmbedUrl(youtubeUrl)}
                className="w-full h-full border-0"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
