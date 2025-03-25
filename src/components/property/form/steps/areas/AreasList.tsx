
import React, { useState } from "react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AreaEditor } from "./AreaEditor";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface AreasListProps {
  areas: PropertyArea[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  propertyImages?: PropertyImage[];
  isUploading?: boolean;
  onReorder?: (reorderedAreas: PropertyArea[]) => void;
  onReorderAreaImages?: (areaId: string, reorderedImageIds: string[]) => void;
}

export function AreasList({
  areas,
  onRemove,
  onUpdate,
  onAreaImageRemove,
  onAreaImageUpload,
  onAreaImagesSelect,
  propertyImages = [],
  isUploading = false,
  onReorder,
  onReorderAreaImages
}: AreasListProps) {
  const [expandedAreas, setExpandedAreas] = useState<string[]>(
    areas.length > 0 ? [areas[0].id] : []
  );

  if (!areas.length) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No areas added yet. Click "Add Area" to get started.</p>
      </div>
    );
  }

  // Handle accordion state changes
  const handleAccordionChange = (value: string[]) => {
    setExpandedAreas(value);
  };

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder) return;
    
    console.log("Drag end event:", result);
    
    const reorderedAreas = [...areas];
    const [removed] = reorderedAreas.splice(result.source.index, 1);
    reorderedAreas.splice(result.destination.index, 0, removed);
    
    onReorder(reorderedAreas);
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="areas-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Accordion 
                type="multiple" 
                value={expandedAreas}
                onValueChange={handleAccordionChange}
              >
                {areas.map((area, index) => (
                  <Draggable 
                    key={area.id} 
                    draggableId={area.id}
                    index={index}
                    isDragDisabled={!onReorder}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <AccordionItem value={area.id} className="border rounded-md mb-4">
                          <div className="flex items-center justify-between px-4">
                            <div 
                              className="flex-1 flex items-center"
                              {...provided.dragHandleProps}
                            >
                              <AccordionTrigger>
                                {area.title || area.name || `Area ${index + 1}`}
                              </AccordionTrigger>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(area.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <AccordionContent>
                            <AreaEditor
                              area={area}
                              onUpdate={(field, value) => onUpdate(area.id, field, value)}
                              onAreaImageRemove={
                                onAreaImageRemove 
                                  ? (imageId) => {
                                      console.log(`Removing image ${imageId} from area ${area.id}`);
                                      onAreaImageRemove(area.id, imageId);
                                    }
                                  : undefined
                              }
                              onAreaImageUpload={
                                onAreaImageUpload
                                  ? (files) => onAreaImageUpload(area.id, files)
                                  : undefined
                              }
                              onAreaImagesSelect={
                                onAreaImagesSelect
                                  ? (imageIds) => {
                                      console.log(`Selecting images for area ${area.id}:`, imageIds);
                                      onAreaImagesSelect(area.id, imageIds);
                                    }
                                  : undefined
                              }
                              onReorderImages={
                                onReorderAreaImages
                                  ? (imageIds) => {
                                      console.log(`Reordering images for area ${area.id}:`, imageIds);
                                      onReorderAreaImages(area.id, imageIds);
                                    }
                                  : undefined
                              }
                              propertyImages={propertyImages}
                              isUploading={isUploading}
                              maxImageSelect={10} // Set maximum images per area to 10
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    )}
                  </Draggable>
                ))}
              </Accordion>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
