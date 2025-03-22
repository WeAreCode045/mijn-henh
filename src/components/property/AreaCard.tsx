import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyArea, PropertyImage } from "@/types/property";
import { AreaSortableImageGrid } from "./AreaSortableImageGrid";
import { AreaCardHeader } from "./area/AreaCardHeader";
import { AreaDescription } from "./area/AreaDescription";
import { AreaColumnsSelector } from "./area/AreaColumnsSelector";
import { AreaImageActions } from "./area/AreaImageActions";
import { AreaImageSelectDialog } from "./area/AreaImageSelectDialog";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AreaCardProps {
  area: PropertyArea;
  images: PropertyImage[];
  propertyId?: string;
  isFirstArea?: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (id: string, imageIds: string[]) => void;
}

type AreaImage = {
  id: string;
  url: string;
  area?: string | null;
  property_id?: string;
  created_at?: string;
  type?: string;
  sort_order?: number;
};

export function AreaCard({
  area,
  images,
  propertyId,
  isFirstArea = false,
  onRemove,
  onUpdate,
  onImageRemove,
  onImagesSelect,
}: AreaCardProps) {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [areaImages, setAreaImages] = useState<AreaImage[]>([]);
  const [isExpanded, setIsExpanded] = useState(isFirstArea);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [keywordsForDescription, setKeywordsForDescription] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAreaImages = async () => {
      if (!area) {
        setAreaImages([]);
        return;
      }
      
      if (propertyId) {
        try {
          const { data, error } = await supabase
            .from('property_images')
            .select('*')
            .eq('property_id', propertyId)
            .eq('area', area.id)
            .order('sort_order', { ascending: true });
            
          if (error) {
            console.error(`Error fetching images for area ${area.id} from property_images:`, error);
          } else if (data && data.length > 0) {
            console.log(`AreaCard ${area.id} - Found ${data.length} images from property_images table:`, data);
            setAreaImages(data as AreaImage[]);
            return;
          } else {
            console.log(`AreaCard ${area.id} - No images found in property_images table, checking area.images`);
            
            if (area.images && Array.isArray(area.images) && area.images.length > 0) {
              console.log(`AreaCard ${area.id} - Using ${area.images.length} images from area.images:`, area.images);
              setAreaImages(area.images as AreaImage[]);
              return;
            }
            
            setAreaImages([]);
          }
        } catch (err) {
          console.error(`Error in fetching area images from property_images:`, err);
        }
      } else {
        if (area.images && Array.isArray(area.images) && area.images.length > 0) {
          console.log(`AreaCard ${area.id} - Using ${area.images.length} images from area.images directly:`, area.images);
          setAreaImages(area.images as AreaImage[]);
        } else {
          setAreaImages([]);
        }
      }
    };
    
    fetchAreaImages();
  }, [area, propertyId, area.images]);

  const handleUpdateTitle = (value: string) => {
    onUpdate(area.id, "title", value);
  };

  const handleUpdateDescription = (value: string) => {
    onUpdate(area.id, "description", value);
  };

  const handleUpdateColumns = (columns: number) => {
    onUpdate(area.id, "columns", columns);
  };

  const handleUpdateImageIds = (imageIds: string[]) => {
    console.log(`Updating area ${area.id} image IDs:`, imageIds);
    
    if (onImagesSelect) {
      onImagesSelect(area.id, imageIds);
    }
  };

  const handleImagesReorder = async (areaId: string, reorderedImages: PropertyImage[]) => {
    if (propertyId) {
      try {
        for (let i = 0; i < reorderedImages.length; i++) {
          await supabase
            .from('property_images')
            .update({ sort_order: i })
            .eq('id', reorderedImages[i].id)
            .eq('property_id', propertyId);
        }
        
        toast({
          title: "Images reordered",
          description: "The display order of images has been updated.",
        });
      } catch (err) {
        console.error("Error updating image order:", err);
        toast({
          title: "Error",
          description: "Failed to update image order",
          variant: "destructive",
        });
      }
    }
    
    setAreaImages(reorderedImages);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const generateDescription = async () => {
    if (!keywordsForDescription.trim()) {
      toast({
        title: "Missing keywords",
        description: "Please enter at least one keyword to generate a description",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      const keywords = keywordsForDescription
        .split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      const { data, error } = await supabase.functions.invoke('generate-area-description', {
        body: {
          keywords: keywords,
          areaName: area.title || area.name,
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.description) {
        handleUpdateDescription(data.description);
        setIsGenerateDialogOpen(false);
        toast({
          title: "Description generated",
          description: "The area description has been generated successfully",
        });
      }
    } catch (err) {
      console.error("Error generating description:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate description",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <Card>
      <AreaCardHeader
        title={area.title}
        areaId={area.id}
        onTitleChange={handleUpdateTitle}
        onRemove={() => onRemove(area.id)}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpand}
          aria-label={isExpanded ? "Collapse area" : "Expand area"}
          type="button"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </AreaCardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <AreaDescription
                description={area.description}
                areaId={area.id}
                onDescriptionChange={handleUpdateDescription}
              />
            </div>
            <Button 
              variant="outline" 
              className="mt-6" 
              onClick={() => setIsGenerateDialogOpen(true)}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
          
          <AreaColumnsSelector
            columns={area.columns || 2}
            areaId={area.id}
            onColumnsChange={handleUpdateColumns}
          />

          <div>
            <AreaImageActions
              onSelectClick={() => setIsSelectDialogOpen(true)}
            />
            
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Selected Images ({areaImages.length}) - Drag to reorder</p>
              <AreaSortableImageGrid
                areaImages={areaImages}
                areaId={area.id}
                areaTitle={area.title}
                onImageRemove={onImageRemove}
                onImagesReorder={handleImagesReorder}
              />
            </div>
          </div>
        </CardContent>
      )}
      
      <AreaImageSelectDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        images={images}
        areaTitle={area.title}
        selectedImageIds={areaImages.map(img => img.id)}
        onUpdate={handleUpdateImageIds}
      />

      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Description for {area.title || "Area"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Label htmlFor="area-keywords">Enter keywords (one per line)</Label>
            <Textarea
              id="area-keywords"
              placeholder="spacious
modern
bright
new appliances
hardwood floors"
              rows={6}
              value={keywordsForDescription}
              onChange={(e) => setKeywordsForDescription(e.target.value)}
            />
            
            <div className="text-sm text-muted-foreground">
              <p>Enter each keyword or phrase on a new line. The AI will use these to generate a compelling description.</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsGenerateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={generateDescription}
              disabled={isGeneratingDescription || !keywordsForDescription.trim()}
            >
              {isGeneratingDescription ? "Generating..." : "Generate Description"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
