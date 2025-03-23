
import { PropertyArea, PropertyImage } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { AreaCardHeader } from "./AreaCardHeader";
import { AreaDescriptionSection } from "./AreaDescriptionSection";
import { AreaImageGridSection } from "./AreaImageGridSection";
import { AreaColumnsSelector } from "./AreaColumnsSelector";

export interface AreaCardProps {
  area: PropertyArea;
  images: PropertyImage[];
  propertyId: string;
  isFirstArea?: boolean;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: any, value: any) => void;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
  isReadOnly?: boolean;
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
  isReadOnly = false
}: AreaCardProps) {
  // Ensure area.images is always an array
  const areaImages = Array.isArray(area.images) ? area.images : [];
  
  return (
    <Card className="border-gray-200">
      <CardContent className="p-0">
        <AreaCardHeader 
          area={area} 
          isFirstArea={isFirstArea} 
          onRemove={onRemove} 
          isReadOnly={isReadOnly}
        />
        
        <div className="p-6 space-y-6">
          {/* Area description section */}
          <AreaDescriptionSection 
            area={area} 
            onUpdate={onUpdate}
            isReadOnly={isReadOnly}
          />
          
          {/* Area columns selector */}
          <AreaColumnsSelector 
            columns={area.columns} 
            onChange={(columns) => onUpdate(area.id, 'columns', columns)}
            isReadOnly={isReadOnly}
          />
          
          {/* Image grid section */}
          <AreaImageGridSection 
            area={area}
            images={images}
            propertyId={propertyId}
            onImageRemove={onImageRemove}
            onImagesSelect={onImagesSelect}
            isReadOnly={isReadOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
}
