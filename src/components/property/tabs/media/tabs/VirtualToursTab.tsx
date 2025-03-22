
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  onVirtualTourSave?: (url: string) => void;
  onYoutubeUrlSave?: (url: string) => void;
  isSaving: boolean;
  isReadOnly?: boolean;
}

export function VirtualToursTab({
  property,
  setProperty,
  onVirtualTourSave,
  onYoutubeUrlSave,
  isSaving,
  isReadOnly = false
}: VirtualToursTabProps) {
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtualTourUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(property.youtubeUrl || '');

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
    </div>
  );
}
