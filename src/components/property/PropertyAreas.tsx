
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { useEffect } from "react";
import { AreaCard } from "./AreaCard";
import { EmptyAreaMessage } from "./EmptyAreaMessage";

interface PropertyAreasProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  propertyId?: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (areaId: string, imageIds: string[]) => void;
  isUploading?: boolean;
}

export function PropertyAreas({
  areas = [],
  images = [],
  propertyId,
  onAdd,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
  isUploading,
}: PropertyAreasProps) {
  useEffect(() => {
    console.log("PropertyAreas - Current areas:", areas);
    console.log("PropertyAreas - Available images:", images);
    console.log("PropertyAreas - Property ID:", propertyId);
    
    // Debug each area's images
    areas.forEach(area => {
      console.log(`Area ${area.id} (${area.title}) - images:`, 
        Array.isArray(area.images) ? area.images : 'Not an array: ' + JSON.stringify(area.images));
    });
  }, [areas, images, propertyId]);

  const handleAddArea = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd();
  };

  // Make sure all areas have images as arrays
  const normalizedAreas = areas.map(area => ({
    ...area,
    images: Array.isArray(area.images) ? area.images : []
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-estate-800">Property Areas</h2>
        <Button 
          onClick={handleAddArea} 
          size="sm" 
          className="flex items-center" 
          type="button"
          disabled={isUploading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </div>

      {!normalizedAreas || normalizedAreas.length === 0 ? (
        <EmptyAreaMessage />
      ) : (
        <div className="space-y-6">
          {normalizedAreas.map((area, index) => (
            <AreaCard
              key={area.id}
              area={area}
              images={images}
              propertyId={propertyId}
              isFirstArea={index === 0}
              onRemove={onRemove}
              onUpdate={onUpdate}
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              onImagesSelect={onImagesSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
