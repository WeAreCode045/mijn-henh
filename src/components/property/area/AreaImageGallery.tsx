
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { Button } from "@/components/ui/button";
import { X, ImagePlus, Move } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImage = ({ id, url, onRemove }: { id: string; url: string; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative rounded-md overflow-hidden border group">
      <img src={url} alt="Area Image" className="w-full h-32 object-cover" />
      <div className="absolute top-1 right-1">
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
        <Move className="h-6 w-6 text-white" />
      </div>
    </div>
  );
};

interface ImageSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allImages: PropertyImage[];
  selectedImageIds: string[];
  onImagesSelect: (imageIds: string[]) => void;
}

function ImageSelectDialog({
  isOpen,
  onClose,
  allImages,
  selectedImageIds,
  onImagesSelect
}: ImageSelectDialogProps) {
  const [selected, setSelected] = useState<string[]>(selectedImageIds);

  const toggleImage = (imageId: string) => {
    setSelected(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSave = () => {
    onImagesSelect(selected);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Images</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {allImages.map(image => (
              <div 
                key={image.id}
                className={`
                  relative rounded-md overflow-hidden border cursor-pointer
                  ${selected.includes(image.id) ? 'ring-2 ring-primary' : ''}
                `}
                onClick={() => toggleImage(image.id)}
              >
                <img 
                  src={image.url} 
                  alt="Property" 
                  className="w-full h-32 object-cover"
                />
                <div className={`
                  absolute inset-0 bg-primary/20 flex items-center justify-center
                  ${selected.includes(image.id) ? 'opacity-100' : 'opacity-0'}
                  transition-opacity
                `}>
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                    ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end space-x-2 p-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Selection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AreaImageGalleryProps {
  areaImages: PropertyImage[];
  allImages: PropertyImage[];
  areaId: string;
  areaTitle: string;
  onImageRemove: (areaId: string, imageId: string) => void;
  onImagesSelect: (areaId: string, imageIds: string[]) => void;
}

export function AreaImageGallery({
  areaImages = [],
  allImages = [],
  areaId,
  areaTitle,
  onImageRemove,
  onImagesSelect
}: AreaImageGalleryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localImages, setLocalImages] = useState(areaImages);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLocalImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        
        // Update the sort order
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update the external state
        onImagesSelect(areaId, newArray.map(img => img.id));
        
        return newArray;
      });
    }
  };

  return (
    <div className="space-y-4">
      {localImages.length > 0 ? (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={localImages.map(img => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {localImages.map((image) => (
                <SortableImage 
                  key={image.id}
                  id={image.id}
                  url={image.url}
                  onRemove={() => onImageRemove(areaId, image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-muted-foreground">No images selected for this area</p>
        </div>
      )}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsDialogOpen(true)}
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        Select Images
      </Button>
      
      <ImageSelectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        allImages={allImages}
        selectedImageIds={localImages.map(img => img.id)}
        onImagesSelect={(imageIds) => onImagesSelect(areaId, imageIds)}
      />
    </div>
  );
}
