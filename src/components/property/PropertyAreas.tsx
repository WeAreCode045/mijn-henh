
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { useEffect } from "react";
import { AreaCard } from "./AreaCard";
import { EmptyAreaMessage } from "./EmptyAreaMessage";

interface PropertyAreasProps {
  areas: PropertyArea[];
  images: PropertyImage[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PropertyArea, value: string | string[] | number) => void;
  onImageUpload: (id: string, files: FileList) => void;
  onImageRemove: (id: string, imageId: string) => void;
  onImagesSelect?: (areaId: string, imageIds: string[]) => void;
}

export function PropertyAreas({
  areas,
  images,
  onAdd,
  onRemove,
  onUpdate,
  onImageUpload,
  onImageRemove,
  onImagesSelect,
}: PropertyAreasProps) {
  useEffect(() => {
    console.log("PropertyAreas - Current areas with columns:", areas);
  }, [areas]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-estate-800">Property Areas</h2>
        <Button onClick={onAdd} size="sm" className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </div>

      {areas.length === 0 ? (
        <EmptyAreaMessage />
      ) : (
        <div className="space-y-6">
          {areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              images={images}
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
