
import React from "react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AreaEditor } from "./AreaEditor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface AreasListProps {
  areas: PropertyArea[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  onAreaImagesSelect?: (areaId: string, imageIds: string[]) => void;
  propertyImages?: PropertyImage[];
  isUploading?: boolean;
}

export function AreasList({
  areas,
  onRemove,
  onUpdate,
  onAreaImageRemove,
  onAreaImageUpload,
  onAreaImagesSelect,
  propertyImages = [],
  isUploading = false
}: AreasListProps) {
  if (!areas.length) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No areas added yet. Click "Add Area" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={areas.length > 0 ? [areas[0].id] : []}>
        {areas.map((area, index) => (
          <AccordionItem key={area.id} value={area.id} className="border rounded-md mb-4">
            <div className="flex items-center justify-between px-4">
              <AccordionTrigger>
                {area.title || area.name || `Area ${index + 1}`}
              </AccordionTrigger>
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
                    ? (imageId) => onAreaImageRemove(area.id, imageId)
                    : undefined
                }
                onAreaImageUpload={
                  onAreaImageUpload
                    ? (files) => onAreaImageUpload(area.id, files)
                    : undefined
                }
                onAreaImagesSelect={
                  onAreaImagesSelect
                    ? (imageIds) => onAreaImagesSelect(area.id, imageIds)
                    : undefined
                }
                propertyImages={propertyImages}
                isUploading={isUploading}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
