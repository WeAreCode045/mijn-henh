
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
  
  // Handle update for specific fields
  const handleTitleChange = (value: string) => {
    if (!isReadOnly) {
      onUpdate(area.id, 'title', value);
    }
  };
  
  const handleDescriptionChange = (value: string) => {
    if (!isReadOnly) {
      onUpdate(area.id, 'description', value);
    }
  };
  
  const handleColumnsChange = (columns: number) => {
    if (!isReadOnly) {
      onUpdate(area.id, 'columns', columns);
    }
  };
  
  const handleGenerateDescription = () => {
    console.log('Generate description for area:', area.id);
    // This would be replaced with actual generation logic
  };
  
  const handleSelectImages = () => {
    if (!isReadOnly) {
      // This would be replaced with actual image selection logic
      console.log('Select images for area:', area.id);
    }
  };
  
  const handleImagesReorder = (areaId: string, reorderedImages: PropertyImage[]) => {
    if (!isReadOnly) {
      // Update the image order
      console.log('Reordering images for area:', areaId);
    }
  };
  
  return (
    <Card className="border-gray-200">
      <CardContent className="p-0">
        <AreaCardHeader 
          title={area.title}
          areaId={area.id}
          onTitleChange={handleTitleChange}
          onRemove={onRemove}
          isReadOnly={isReadOnly}
        />
        
        <div className="p-6 space-y-6">
          {/* Area description section */}
          <AreaDescriptionSection 
            description={area.description}
            areaId={area.id}
            onDescriptionChange={handleDescriptionChange}
            onGenerateClick={handleGenerateDescription}
            isReadOnly={isReadOnly}
          />
          
          {/* Area columns selector */}
          <AreaColumnsSelector 
            columns={area.columns}
            areaId={area.id}
            onColumnsChange={handleColumnsChange}
            isReadOnly={isReadOnly}
          />
          
          {/* Image grid section */}
          <AreaImageGridSection 
            areaId={area.id}
            areaTitle={area.title}
            areaImages={areaImages as PropertyImage[]}
            onSelectClick={handleSelectImages}
            onImageRemove={onImageRemove}
            onImagesReorder={handleImagesReorder}
            isReadOnly={isReadOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
}
