
import { PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { SortableFloorplanGrid } from "./floorplans/SortableFloorplanGrid";
import { FloorplanUploader } from "./floorplans/FloorplanUploader";
import { Button } from "@/components/ui/button";
import { useSortableFloorplans } from "@/hooks/images/useSortableFloorplans";
import { DragEndEvent } from "@dnd-kit/core";
import { Dispatch, SetStateAction } from "react";

interface FloorplansCardProps {
  floorplans: PropertyImage[];
  setFloorplans: Dispatch<SetStateAction<PropertyImage[]>>;
  propertyId: string;
  onDelete: (id: string) => void;
  onUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
}

export function FloorplansCard({
  floorplans,
  setFloorplans,
  propertyId,
  onDelete,
  onUpload,
  isUploading,
}: FloorplansCardProps) {
  const { handleDragEnd, isSavingOrder } = useSortableFloorplans(propertyId);

  const handleDragEndWrapper = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = floorplans.findIndex(item => item.id === active.id);
      const newIndex = floorplans.findIndex(item => item.id === over?.id);
      
      const newFloorplans = [...floorplans];
      const [movedItem] = newFloorplans.splice(oldIndex, 1);
      newFloorplans.splice(newIndex, 0, movedItem);
      
      setFloorplans(newFloorplans);
      await handleDragEnd(event);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Floorplans</CardTitle>
      </CardHeader>
      <CardContent>
        <FloorplanUploader onUpload={onUpload} isUploading={isUploading} />
        
        {floorplans.length > 0 ? (
          <SortableFloorplanGrid
            items={floorplans}
            onDragEnd={handleDragEndWrapper}
            isSaving={isSavingOrder}
            renderItem={(item) => (
              <div className="relative group">
                <img 
                  src={item.url} 
                  alt="Floorplan" 
                  className="w-full h-40 object-contain border rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-2">No floorplans yet</p>
            <p className="text-sm text-muted-foreground">
              Upload floorplans to showcase the property layout
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
