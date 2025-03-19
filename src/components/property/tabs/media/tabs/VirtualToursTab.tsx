
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VideoIcon } from "lucide-react";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export function VirtualToursTab({
  property,
  setProperty,
  isSaving,
  setIsSaving
}: VirtualToursTabProps) {
  const [virtualTourUrl, setVirtualTourUrl] = useState<string>(property.virtualTourUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState<string>(property.youtubeUrl || "");
  
  const handleSaveVirtualTour = async () => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property with the new virtual tour URL
      const { error } = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          virtualTourUrl
        }),
      }).then(res => res.json());
      
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        virtualTourUrl
      }));
      
    } catch (error) {
      console.error('Error saving virtual tour URL:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveYoutubeUrl = async () => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property with the new YouTube URL
      const { error } = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl
        }),
      }).then(res => res.json());
      
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        youtubeUrl
      }));
      
    } catch (error) {
      console.error('Error saving YouTube URL:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <VideoIcon className="h-5 w-5" />
          Virtual Tours & Videos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Matterport or other 3D Tour URL</h3>
          <div className="flex gap-2">
            <Input
              value={virtualTourUrl}
              onChange={(e) => setVirtualTourUrl(e.target.value)}
              placeholder="Paste 3D tour embed URL here"
            />
            <Button onClick={handleSaveVirtualTour} disabled={isSaving}>Save</Button>
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
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube video URL here"
            />
            <Button onClick={handleSaveYoutubeUrl} disabled={isSaving}>Save</Button>
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
