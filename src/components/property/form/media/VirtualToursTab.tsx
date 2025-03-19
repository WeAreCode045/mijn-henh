
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VirtualToursTabProps {
  virtualTourUrl: string;
  youtubeUrl: string;
  onVirtualTourUpdate: (url: string) => void;
  onYoutubeUrlUpdate: (url: string) => void;
}

export function VirtualToursTab({
  virtualTourUrl,
  youtubeUrl,
  onVirtualTourUpdate,
  onYoutubeUrlUpdate
}: VirtualToursTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Tours & Videos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="virtual-tour-url">Virtual Tour URL</Label>
          <Input
            id="virtual-tour-url"
            placeholder="https://my.matterport.com/show/?m=..."
            value={virtualTourUrl}
            onChange={(e) => onVirtualTourUpdate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL for the property's virtual tour (Matterport, etc.)
          </p>
          
          {virtualTourUrl && (
            <div className="mt-4 border rounded-md p-2">
              <h4 className="text-sm font-medium mb-2">Preview:</h4>
              <div className="aspect-video bg-muted/50 rounded flex items-center justify-center p-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Virtual tour will be embedded here in the property view
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube-url">YouTube Video URL</Label>
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => onYoutubeUrlUpdate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter a YouTube video URL for the property
          </p>
          
          {youtubeUrl && (
            <div className="mt-4 border rounded-md p-2">
              <h4 className="text-sm font-medium mb-2">Preview:</h4>
              <div className="aspect-video bg-muted/50 rounded flex items-center justify-center p-2 text-center">
                <p className="text-sm text-muted-foreground">
                  YouTube video will be embedded here in the property view
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
