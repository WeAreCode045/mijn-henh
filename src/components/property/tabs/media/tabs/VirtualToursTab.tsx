
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface VirtualToursTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  onVirtualTourSave: (url: string) => void;
  onYoutubeUrlSave: (url: string) => void;
  onFloorplanEmbedScriptSave: (script: string) => void;
  isSaving?: boolean;
}

export function VirtualToursTab({
  property,
  setProperty,
  onVirtualTourSave,
  onYoutubeUrlSave,
  onFloorplanEmbedScriptSave,
  isSaving = false
}: VirtualToursTabProps) {
  const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtualTourUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(property.youtubeUrl || "");
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState(property.floorplanEmbedScript || "");
  const [activeTab, setActiveTab] = useState<string>("virtual-tour");

  const handleSaveVirtualTour = () => {
    onVirtualTourSave(virtualTourUrl);
  };
  
  const handleSaveYoutubeUrl = () => {
    onYoutubeUrlSave(youtubeUrl);
  };
  
  const handleSaveFloorplanEmbed = () => {
    onFloorplanEmbedScriptSave(floorplanEmbedScript);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Virtual Tours and Embeds</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="virtual-tour">Virtual Tour</TabsTrigger>
              <TabsTrigger value="youtube">YouTube Video</TabsTrigger>
              <TabsTrigger value="floorplan-embed">Floorplan Embed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="virtual-tour" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="virtualTourUrl" className="text-sm font-medium">Virtual Tour URL</label>
                <Input
                  id="virtualTourUrl"
                  value={virtualTourUrl}
                  onChange={(e) => setVirtualTourUrl(e.target.value)}
                  placeholder="Enter virtual tour URL"
                />
              </div>
              <Button 
                onClick={handleSaveVirtualTour} 
                disabled={isSaving || virtualTourUrl === property.virtualTourUrl}
              >
                Save Virtual Tour
              </Button>
              
              {property.virtualTourUrl && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="w-full h-96 border rounded overflow-hidden">
                    <iframe
                      src={property.virtualTourUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title="Virtual Tour"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="youtube" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="youtubeUrl" className="text-sm font-medium">YouTube Video URL</label>
                <Input
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Enter YouTube video URL"
                />
              </div>
              <Button 
                onClick={handleSaveYoutubeUrl} 
                disabled={isSaving || youtubeUrl === property.youtubeUrl}
              >
                Save YouTube URL
              </Button>
              
              {property.youtubeUrl && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="w-full h-96 border rounded overflow-hidden">
                    <iframe
                      src={property.youtubeUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="YouTube Video"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="floorplan-embed" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="floorplanEmbed" className="text-sm font-medium">Floorplan Embed Script</label>
                <Textarea
                  id="floorplanEmbed"
                  value={floorplanEmbedScript}
                  onChange={(e) => setFloorplanEmbedScript(e.target.value)}
                  placeholder="Enter floorplan embed script"
                  rows={8}
                />
              </div>
              <Button 
                onClick={handleSaveFloorplanEmbed} 
                disabled={isSaving || floorplanEmbedScript === property.floorplanEmbedScript}
              >
                Save Embed Script
              </Button>
              
              {property.floorplanEmbedScript && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="w-full min-h-96 border rounded p-4 overflow-hidden" 
                    dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }} 
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
