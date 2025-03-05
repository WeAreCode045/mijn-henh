
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useState, useEffect, createRef } from "react";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { FloorplanDatabaseFetcher } from "./floorplans/FloorplanDatabaseFetcher";
import { PropertyFloorplan } from "@/types/property";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableFloorplanItem } from "./floorplans/SortableFloorplanItem";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FloorplanCardProps {
  id?: string;
  floorplans?: any[];
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  isUploading?: boolean;
}

export function FloorplansCard({
  id,
  floorplans = [],
  onFloorplanUpload,
  onRemoveFloorplan,
  isUploading = false,
}: FloorplanCardProps) {
  const [uploading, setUploading] = useState(isUploading);
  const [displayFloorplans, setDisplayFloorplans] = useState<PropertyFloorplan[]>(
    Array.isArray(floorplans) ? floorplans : []
  );
  const fileInputRef = createRef<HTMLInputElement>();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  useEffect(() => {
    if (floorplans && floorplans.length > 0) {
      // Sort floorplans by sort_order when they come in
      const sortedFloorplans = [...floorplans].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      setDisplayFloorplans(sortedFloorplans);
    }
  }, [floorplans]);

  const handleFloorplanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (onFloorplanUpload) {
      onFloorplanUpload(e);
    }
    // Reset the file input value
    e.target.value = '';
  };

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper function to get the URL from a floorplan object
  const getFloorplanUrl = (floorplan: any): string => {
    if (typeof floorplan === 'string') return floorplan;
    if (floorplan && typeof floorplan === 'object' && 'url' in floorplan) return floorplan.url;
    return '';
  };

  const handleFetchComplete = (fetchedFloorplans: PropertyFloorplan[]) => {
    if (fetchedFloorplans.length > 0) {
      // Ensure floorplans are sorted by sort_order
      const sortedFloorplans = [...fetchedFloorplans].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      setDisplayFloorplans(sortedFloorplans);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = displayFloorplans.findIndex(item => item.id === active.id);
      const newIndex = displayFloorplans.findIndex(item => item.id === over.id);
      
      const reorderedFloorplans = arrayMove(displayFloorplans, oldIndex, newIndex);
      
      // Update each item with a new sort_order based on its position
      const updatedFloorplans = reorderedFloorplans.map((floorplan, index) => ({
        ...floorplan,
        sort_order: index + 1 // 1-based indexing for sort_order
      }));
      
      // Update the local state
      setDisplayFloorplans(updatedFloorplans);
      
      // Save the new order to the database if we have a property ID
      if (id) {
        try {
          // Update sort_order for each floorplan in the database
          const updatePromises = updatedFloorplans.map((floorplan, index) => {
            if (!floorplan.id || typeof floorplan.id !== 'string' || floorplan.id.startsWith('temp-')) {
              console.log('Skipping floorplan without valid ID:', floorplan);
              return Promise.resolve();
            }
            
            return supabase
              .from('property_images')
              .update({ sort_order: index + 1 }) // 1-based indexing
              .eq('property_id', id)
              .eq('id', floorplan.id)
              .eq('type', 'floorplan');
          });
          
          await Promise.all(updatePromises);
          
          toast({
            title: "Order updated",
            description: "Floorplan order has been saved",
          });
        } catch (error) {
          console.error('Error saving floorplan order:', error);
          toast({
            title: "Error",
            description: "Failed to save floorplan order",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Floorplans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden database fetcher component */}
        {id && (
          <FloorplanDatabaseFetcher
            propertyId={id}
            floorplans={displayFloorplans}
            onFetchComplete={handleFetchComplete}
          />
        )}

        <div className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={handleUploadClick}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Floorplans"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFloorplanUpload}
            disabled={uploading}
          />
          
          <div className="w-full">
            {displayFloorplans && displayFloorplans.length > 0 ? (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={displayFloorplans.map(floorplan => floorplan.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {displayFloorplans.map((floorplan, index) => {
                      const url = getFloorplanUrl(floorplan);
                      const label = floorplan.title || `Floorplan ${index + 1}`;
                      
                      return (
                        <SortableFloorplanItem
                          key={floorplan.id}
                          id={floorplan.id}
                          url={url}
                          label={label}
                          onRemove={() => onRemoveFloorplan && onRemoveFloorplan(index)}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                No floorplans uploaded yet. Click "Upload Floorplans" to add floorplans.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
