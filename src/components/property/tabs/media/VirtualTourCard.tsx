
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface VirtualTourCardProps {
  id?: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  onVirtualTourUpdate: (url: string) => void;
  onYoutubeUrlUpdate: (url: string) => void;
  isReadOnly?: boolean; // Added isReadOnly prop
}

export function VirtualTourCard({
  id = "",
  virtualTourUrl = "",
  youtubeUrl = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate,
  isReadOnly = false // Default to false to maintain backward compatibility
}: VirtualTourCardProps) {
  const [localVirtualTourUrl, setLocalVirtualTourUrl] = useState(virtualTourUrl);
  const [localYoutubeUrl, setLocalYoutubeUrl] = useState(youtubeUrl);

  const handleVirtualTourSubmit = () => {
    onVirtualTourUpdate(localVirtualTourUrl);
  };

  const handleYoutubeUrlSubmit = () => {
    onYoutubeUrlUpdate(localYoutubeUrl);
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
              disabled={isReadOnly}
            />
            <Button onClick={handleVirtualTourSubmit} disabled={isReadOnly}>Save</Button>
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
              disabled={isReadOnly}
            />
            <Button onClick={handleYoutubeUrlSubmit} disabled={isReadOnly}>Save</Button>
          </div>
          {youtubeUrl && (
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={youtubeUrl.replace("watch?v=", "embed/")}
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
