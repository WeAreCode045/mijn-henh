
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ImageUpload, Video, Youtube } from "lucide-react";
import { PropertyImage, PropertyFloorplan } from "@/types/property";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface PropertyMediaTabProps {
  id: string;
  images: PropertyImage[];
  floorplans: PropertyFloorplan[];
  virtualTourUrl?: string;
  youtubeUrl?: string;
  notes?: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveFloorplan: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
}

export function PropertyMediaTab({
  id,
  images = [],
  floorplans = [],
  virtualTourUrl = "",
  youtubeUrl = "",
  notes = "",
  onImageUpload,
  onFloorplanUpload,
  onRemoveImage,
  onRemoveFloorplan,
  onUpdateFloorplan,
}: PropertyMediaTabProps) {
  const [currentVirtualTourUrl, setCurrentVirtualTourUrl] = useState(virtualTourUrl);
  const [currentYoutubeUrl, setCurrentYoutubeUrl] = useState(youtubeUrl);
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveExternalLinks = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          virtualTourUrl: currentVirtualTourUrl,
          youtubeUrl: currentYoutubeUrl,
          notes: currentNotes
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        description: "External links saved successfully",
      });
    } catch (error) {
      console.error('Error saving external links:', error);
      toast({
        title: "Error",
        description: "Failed to save external links",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageUpload className="h-5 w-5" />
            Property Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Property Images ({images.length})</h3>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-md text-gray-500">
                  <p>No images have been added yet</p>
                </div>
              )}
            </div>
            
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.accept = "image/*";
                  input.onchange = onImageUpload as any;
                  input.click();
                }}
              >
                Upload Images
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageUpload className="h-5 w-5" />
            Floorplans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Floorplans ({floorplans.length})</h3>
              
              {floorplans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {floorplans.map((floorplan, index) => (
                    <div key={index} className="relative border rounded-md p-3">
                      <img
                        src={floorplan.url}
                        alt={`Floorplan ${index + 1}`}
                        className="w-full h-40 object-contain"
                      />
                      
                      {onUpdateFloorplan && (
                        <div className="mt-2">
                          <Label htmlFor={`columns-${index}`}>Display Columns</Label>
                          <select
                            id={`columns-${index}`}
                            value={floorplan.columns || 1}
                            onChange={(e) => onUpdateFloorplan(index, 'columns', parseInt(e.target.value))}
                            className="block w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                          >
                            <option value={1}>1 Column</option>
                            <option value={2}>2 Columns</option>
                            <option value={3}>3 Columns</option>
                            <option value={4}>4 Columns</option>
                          </select>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => onRemoveFloorplan(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-md text-gray-500">
                  <p>No floorplans have been added yet</p>
                </div>
              )}
            </div>
            
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = true;
                  input.accept = "image/*";
                  input.onchange = onFloorplanUpload as any;
                  input.click();
                }}
              >
                Upload Floorplans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Virtual Tour & Videos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="virtual-tour">Virtual Tour URL (360° Tour)</Label>
            <Input 
              id="virtual-tour" 
              placeholder="https://example.com/virtual-tour" 
              value={currentVirtualTourUrl}
              onChange={(e) => setCurrentVirtualTourUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL for an external 360° tour (Matterport, etc.)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" /> YouTube Video URL
            </Label>
            <Input 
              id="youtube" 
              placeholder="https://youtube.com/watch?v=..." 
              value={currentYoutubeUrl}
              onChange={(e) => setCurrentYoutubeUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter a YouTube video URL to embed in property views
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Property Notes (Internal)</Label>
            <Textarea
              id="notes"
              placeholder="Add private notes about this property..."
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              These notes are for internal use only and won't be shown to clients
            </p>
          </div>
          
          <Button 
            onClick={handleSaveExternalLinks}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save External Links"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
