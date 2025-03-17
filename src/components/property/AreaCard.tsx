
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PropertyArea, PropertyImage } from "@/types/property";
import { AreaCardHeader } from "./area/AreaCardHeader";
import { AreaContent } from "./area/AreaContent";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAreaImages } from "./area/useAreaImages";

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
  const [isExpanded, setIsExpanded] = useState(isFirstArea);
  const { areaImages } = useAreaImages(area, propertyId);

  const handleUpdateTitle = (value: string) => {
    onUpdate(area.id, "title", value);
  };

  const handleUpdateDescription = (value: string) => {
    onUpdate(area.id, "description", value);
  };

  const handleUpdateColumns = (columns: number) => {
    onUpdate(area.id, "columns", columns);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleImagesSelect = (areaId: string, imageIds: string[]) => {
    if (onImagesSelect) {
      onImagesSelect(areaId, imageIds);
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
        <AreaContent 
          area={area}
          areaImages={areaImages}
          allImages={images}
          onUpdateDescription={handleUpdateDescription}
          onUpdateColumns={handleUpdateColumns}
          onImageRemove={onImageRemove}
          onImagesSelect={handleImagesSelect}
        />
      )}
    </Card>
  );
}
