
import { PropertyArea } from "./PropertyArea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PropertyImage, PropertyArea as PropertyAreaType } from "@/types/property";
import { ChangeEvent } from "react";

interface PropertyAreasProps {
  areas: PropertyAreaType[];
  images: PropertyImage[];
  propertyId: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  isUploading?: boolean;
}

export function PropertyAreas({
  areas,
  images,
  propertyId,
  onAdd,
  onRemove,
  onUpdate,
  onImageRemove,
  onImagesSelect,
  onImageUpload,
  handleAreaImageUpload,
  isUploading = false,
}: PropertyAreasProps) {
  return (
    <div>
      <div className="mb-4">
        <Button
          type="button" 
          variant="outline" 
          onClick={onAdd} 
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Area
        </Button>
      </div>
      
      {areas.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
          No areas added yet. Click the button above to add an area.
        </div>
      )}
      
      {areas.map((area) => {
        // Get the images assigned to this area
        const areaImages = images.filter(img => {
          // Check if image is assigned to this area based on area property or imageIds
          if (img.area === area.id) return true;
          if (area.imageIds && area.imageIds.includes(img.id)) return true;
          return false;
        });
        
        return (
          <PropertyArea
            key={area.id}
            id={area.id}
            title={area.title}
            description={area.description}
            images={areaImages}
            allImages={images}
            onRemove={() => onRemove(area.id)}
            onUpdate={(field, value) => onUpdate(area.id, field, value)}
            onImageUpload={onImageUpload}
            onImageRemove={(imageId) => onImageRemove(area.id, imageId)}
            onImagesSelect={(imageIds) => onImagesSelect(area.id, imageIds)}
            handleAreaImageUpload={handleAreaImageUpload}
            isUploading={isUploading}
          />
        );
      })}
    </div>
  );
}
