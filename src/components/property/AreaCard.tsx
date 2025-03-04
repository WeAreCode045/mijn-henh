
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

interface AreaCardProps {
  area: PropertyArea;
  images: PropertyImage[];
  propertyId?: string;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (id: string, imageIds: string[]) => void;
}

export function AreaCard({
  area,
  images,
  propertyId,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
}: AreaCardProps) {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [areaImages, setAreaImages] = useState<PropertyImage[]>([]);
  
  // Get area images based on imageIds whenever area or images change
  useEffect(() => {
    const fetchAreaImages = async () => {
      if (!area) {
        setAreaImages([]);
        return;
      }
      
      // If we have a propertyId, try to fetch images from property_images table first
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
            setAreaImages(data as PropertyImage[]);
            return;
          }
        } catch (err) {
          console.error(`Error in fetching area images from property_images:`, err);
        }
      }
      
      // Fallback to using imageIds from area if no images found in property_images
      // This maintains backward compatibility
      const imageIds = Array.isArray(area.imageIds) ? area.imageIds : [];
      console.log(`AreaCard ${area.id} - Finding images for imageIds (fallback):`, imageIds);
      
      if (imageIds.length > 0 && images && images.length > 0) {
        // Find corresponding image objects for each ID
        const foundImages = images.filter(img => imageIds.includes(img.id));
        console.log(`AreaCard ${area.id} - Found ${foundImages.length} images from ${imageIds.length} imageIds`);
        console.log(`Found image details:`, foundImages);
        setAreaImages(foundImages);
      } else {
        console.log(`AreaCard ${area.id} - No imageIds available or empty array`);
        setAreaImages([]);
      }
    };
    
    fetchAreaImages();
  }, [area, images, propertyId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log(`AreaCard ${area.id} - Uploading ${event.target.files.length} files`);
      onImageUpload(area.id, event.target.files);
    }
  };

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
    
    // Additional callback for external handling if needed
    if (onImagesSelect) {
      onImagesSelect(area.id, imageIds);
    }
  };

  // Function for upload button click that doesn't require an event parameter
  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      if (e && e.target) {
        const syntheticEvent = {
          target: e.target as HTMLInputElement
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleFileUpload(syntheticEvent);
      }
    };
    input.click();
  };

  return (
    <Card>
      <AreaCardHeader
        title={area.title}
        areaId={area.id}
        onTitleChange={handleUpdateTitle}
        onRemove={() => onRemove(area.id)}
      />

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
            onUploadClick={handleUploadClick}
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
