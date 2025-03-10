import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Youtube } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
}

export function VirtualToursTab({ property, setProperty }: VirtualToursTabProps) {
  const handleVirtualTourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProperty(prev => ({
      ...prev,
      virtualTourUrl: e.target.value
    }));
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProperty(prev => ({
      ...prev,
      youtubeUrl: e.target.value
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProperty(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Virtual Tour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
            <Input
              id="virtualTourUrl"
              placeholder="https://vt.mypropertytour.com/123456"
              value={property.virtualTourUrl || ''}
              onChange={handleVirtualTourChange}
            />
            <p className="text-sm text-muted-foreground">
              Enter the direct URL to the virtual tour of this property
            </p>
          </div>

          {property.virtualTourUrl && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="aspect-video mt-2 border rounded overflow-hidden">
                <iframe
                  src={property.virtualTourUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title="Virtual Tour"
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Youtube className="mr-2 h-5 w-5" />
            YouTube Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://youtube.com/watch?v=..."
              value={property.youtubeUrl || ''}
              onChange={handleYoutubeChange}
            />
            <p className="text-sm text-muted-foreground">
              Enter the YouTube URL for a video about this property
            </p>
          </div>

          {property.youtubeUrl && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="aspect-video mt-2 border rounded overflow-hidden">
                <iframe
                  src={property.youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add internal notes about this property..."
            className="min-h-[150px]"
            value={property.notes || ''}
            onChange={handleNotesChange}
          />
          <p className="text-sm text-muted-foreground mt-2">
            These notes are for internal use only and won't be visible to clients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
