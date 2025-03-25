
import React, { useState, useEffect } from "react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { ImageSelectDialog } from "@/components/property/ImageSelectDialog";
import { AreaImageSelectDialog } from "@/components/property/area/AreaImageSelectDialog";

interface AreaEditorProps {
  area: PropertyArea;
  onUpdate: (field: string, value: any) => void;
  onAreaImageRemove?: (imageId: string) => void;
  onAreaImageUpload?: (files: FileList) => Promise<void>;
  onAreaImagesSelect?: (imageIds: string[]) => void;
  onReorderImages?: (imageIds: string[]) => void;
  propertyImages?: { id: string; url: string }[];
  isUploading?: boolean;
  maxImageSelect?: number;
}

export function AreaEditor({
  area,
  onUpdate,
  onAreaImageRemove,
  onAreaImageUpload,
  onAreaImagesSelect,
  onReorderImages,
  propertyImages = [],
  isUploading = false,
  maxImageSelect = 10
}: AreaEditorProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  
  useEffect(() => {
    if (area.title && area.title !== area.name) {
      onUpdate("name", area.title);
    }
  }, [area.title, area.name, onUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate(name, value);
    
    if (name === "name") {
      onUpdate("title", value);
    }
  };

  const handleImagesSelect = (selectedIds: string[]) => {
    if (onAreaImagesSelect) {
      onAreaImagesSelect(selectedIds);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderImages || !area.imageIds) return;
    
    const reorderedImages = [...area.imageIds];
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);
    
    onReorderImages(reorderedImages);
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <Label htmlFor={`area-name-${area.id}`}>Name</Label>
            <Input
              id={`area-name-${area.id}`}
              name="name"
              value={area.name || area.title || ''}
              onChange={handleInputChange}
              placeholder="Area name (e.g. Living Room, Kitchen)"
            />
          </div>
          
          <div>
            <Label htmlFor={`area-description-${area.id}`}>Description</Label>
            <Textarea
              id={`area-description-${area.id}`}
              name="description"
              value={area.description || ''}
              onChange={handleInputChange}
              placeholder="Describe this area..."
              rows={5}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="images">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setIsSelectDialogOpen(true)}
              className="w-full"
            >
              Select Images from Media Library
            </Button>
            
            <div className="mt-2 text-sm text-muted-foreground">
              {area.imageIds ? area.imageIds.length : 0} of {maxImageSelect} images selected.
              {onReorderImages && area.imageIds && area.imageIds.length > 1 && 
                " Drag to reorder images."
              }
            </div>
            
            {area.images && area.images.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="area-images" direction="horizontal">
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps} 
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4"
                    >
                      {(area.imageIds || []).map((imageId, index) => {
                        // Find the image object for this ID
                        const imageObj = area.images.find(img => 
                          typeof img === 'string' 
                            ? img === imageId 
                            : img.id === imageId
                        );
                        
                        if (!imageObj) return null;
                        
                        const imageUrl = typeof imageObj === 'string' 
                          ? imageObj 
                          : imageObj.url;
                          
                        return (
                          <Draggable 
                            key={imageId} 
                            draggableId={imageId} 
                            index={index}
                            isDragDisabled={!onReorderImages}
                          >
                            {(provided) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative group"
                              >
                                <img 
                                  src={imageUrl} 
                                  alt={`Area image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                                {onAreaImageRemove && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                                    onClick={() => onAreaImageRemove(imageId)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                  </Button>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                                  Position: {index + 1}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 border border-dashed rounded-md">
                No images selected. Click "Select Images" to add images from the media library.
              </div>
            )}
          </div>
          
          <AreaImageSelectDialog
            images={propertyImages}
            selectedImageIds={area.imageIds || []}
            onUpdate={handleImagesSelect}
            open={isSelectDialogOpen}
            onOpenChange={setIsSelectDialogOpen}
            areaTitle={area.title || area.name || "Area"}
            maxSelect={maxImageSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
