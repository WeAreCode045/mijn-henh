
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, X, Image, FileText, Video360, Youtube } from "lucide-react";
import { PropertyImage, PropertyFloorplan } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyMediaTabProps {
  id: string;
  images: PropertyImage[];
  floorplans: PropertyFloorplan[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveFloorplan: (index: number) => void;
  onUpdateFloorplan: (index: number, field: keyof PropertyFloorplan, value: any) => void;
}

export function PropertyMediaTab({
  id,
  images = [],
  floorplans = [],
  virtualTourUrl = "",
  youtubeUrl = "",
  onImageUpload,
  onFloorplanUpload,
  onRemoveImage,
  onRemoveFloorplan,
  onUpdateFloorplan,
}: PropertyMediaTabProps) {
  const [activeTab, setActiveTab] = useState("photos");
  const [tourUrl, setTourUrl] = useState(virtualTourUrl);
  const [videoUrl, setVideoUrl] = useState(youtubeUrl);
  const { toast } = useToast();
  
  const handleSaveUrls = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          virtualTourUrl: tourUrl,
          youtubeUrl: videoUrl
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        description: "URLs saved successfully",
      });
    } catch (error) {
      console.error('Error saving URLs:', error);
      toast({
        title: "Error",
        description: "Failed to save URLs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Property Photos
          </TabsTrigger>
          <TabsTrigger value="floorplans" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Floorplans
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video360 className="h-4 w-4" />
            Virtual Tour & Video
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={onImageUpload}
                  accept="image/*"
                  multiple
                  id="property-images"
                />
                <Label htmlFor="property-images" className="sr-only">
                  Upload Images
                </Label>
              </div>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group aspect-square">
                      <img
                        src={image.url}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No images uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="floorplans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Floorplans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={onFloorplanUpload}
                  accept="image/*"
                  multiple
                  id="floorplan-images"
                />
                <Label htmlFor="floorplan-images" className="sr-only">
                  Upload Floorplans
                </Label>
              </div>
              
              {floorplans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {floorplans.map((floorplan, index) => (
                    <div key={index} className="relative border rounded-md p-3 bg-white">
                      <div className="flex flex-col space-y-3">
                        <div className="relative aspect-video">
                          <img 
                            src={floorplan.url} 
                            alt={`Floorplan ${index + 1}`} 
                            className="w-full h-full object-contain rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => onRemoveFloorplan(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="flex-shrink-0">Columns:</Label>
                          <select
                            value={String(floorplan.columns || 1)}
                            onChange={(e) => onUpdateFloorplan(index, 'columns', parseInt(e.target.value))}
                            className="h-9 w-24 rounded-md border border-input bg-background px-3 py-1"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No floorplans uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Tour & Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="virtual-tour-url">360° Virtual Tour URL</Label>
                  <Input
                    id="virtual-tour-url"
                    value={tourUrl}
                    onChange={(e) => setTourUrl(e.target.value)}
                    placeholder="https://my360tour.com/property"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the URL to your 360° virtual tour (e.g., Matterport, VPiX)
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="youtube-url">YouTube Video URL</Label>
                  <Input
                    id="youtube-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the URL to your YouTube property video
                  </p>
                </div>
              </div>
              
              <Button onClick={handleSaveUrls}>Save URLs</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
