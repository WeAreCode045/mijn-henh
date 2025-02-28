
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Video, Youtube } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VirtualTourCardProps {
  id: string;
  virtualTourUrl: string;
  youtubeUrl: string;
  notes: string;
  onVirtualTourUpdate?: (url: string) => void;
  onYoutubeUrlUpdate?: (url: string) => void;
}

export function VirtualTourCard({
  id,
  virtualTourUrl = "",
  youtubeUrl = "",
  notes = "",
  onVirtualTourUpdate,
  onYoutubeUrlUpdate
}: VirtualTourCardProps) {
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
      
      // Call the update handlers if they exist
      if (onVirtualTourUpdate) onVirtualTourUpdate(currentVirtualTourUrl);
      if (onYoutubeUrlUpdate) onYoutubeUrlUpdate(currentYoutubeUrl);
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
  );
}
