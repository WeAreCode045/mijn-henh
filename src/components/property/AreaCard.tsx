
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyArea, PropertyImage } from "@/types/property";
import { AreaImageGrid } from "./AreaImageGrid";
import { AreaCardHeader } from "./area/AreaCardHeader";
import { AreaDescription } from "./area/AreaDescription";
import { AreaColumnsSelector } from "./area/AreaColumnsSelector";
import { AreaImageActions } from "./area/AreaImageActions";
import { AreaImageSelectDialog } from "./area/AreaImageSelectDialog";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeImage } from "@/utils/imageHelpers";

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

// Create an interface that conforms to PropertyImage
interface AreaImageData {
  id: string;
  url: string;
  area?: string | null;
  property_id?: string;
  is_main?: boolean;
  is_featured_image?: boolean;
  sort_order?: number;
  type: string;
  created_at?: string;
}

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
  const [areaImages, setAreaImages] = useState<PropertyImage[]>([]);
  const [isExpanded, setIsExpanded] = useState(isFirstArea);
  
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
            .eq('area', area.id);
            
          if (error) {
            console.error(`Error fetching images for area ${area.id} from property_images:`, error);
          } else if (data && data.length > 0) {
            console.log(`AreaCard ${area.id} - Found ${data.length} images from property_images table:`, data);
            // Convert the raw data to PropertyImage[] with correctly typed 'type' property
            const convertedImages: PropertyImage[] = data.map((img: AreaImageData) => ({
              id: img.id,
              url: img.url,
              area: img.area,
              type: (img.type === "floorplan" ? "floorplan" : "image") as "image" | "floorplan",
              is_main: img.is_main,
              is_featured_image: img.is_featured_image,
              sort_order: img.sort_order,
              property_id: img.property_id
            }));
            setAreaImages(convertedImages);
            return;
          } else {
            console.log(`AreaCard ${area.id} - No images found in property_images table`);
            setAreaImages([]);
          }
        } catch (err) {
          console.error(`Error in fetching area images from property_images:`, err);
        }
      } else {
        if (area.images && area.images.length > 0) {
          const normalizedImages = area.images.map(img => {
            const normalized = normalizeImage(img);
            // Ensure type is always "image" or "floorplan"
            return {
              ...normalized,
              type: (normalized.type === "floorplan" ? "floorplan" : "image") as "image" | "floorplan"
            };
          });
          setAreaImages(normalizedImages);
        } else {
          setAreaImages([]);
        }
      }
    };
    
    fetchAreaImages();
  }, [area, propertyId]);

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

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
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
          <AreaDescription
            description={area.description}
            areaId={area.id}
            onDescriptionChange={handleUpdateDescription}
          />
          
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
              <p className="text-sm font-medium mb-2">Selected Images ({areaImages.length})</p>
              <AreaImageGrid
                areaImages={areaImages}
                areaId={area.id}
                areaTitle={area.title}
                onImageRemove={onImageRemove}
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
    </Card>
  );
}
