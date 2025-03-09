
import { useState, useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSortableFloorplans(
  propertyId: string | undefined,
  initialFloorplans: PropertyImage[] = []
) {
  const [floorplans, setFloorplans] = useState<PropertyImage[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    // Initialize floorplans from props
    if (initialFloorplans && initialFloorplans.length > 0) {
      // Sort floorplans by sort_order if available
      const sortedFloorplans = [...initialFloorplans].sort((a, b) => {
        const aOrder = typeof a === 'object' && a.sort_order ? a.sort_order : 0;
        const bOrder = typeof b === 'object' && b.sort_order ? b.sort_order : 0;
        return aOrder - bOrder;
      });
      
      setFloorplans(sortedFloorplans);
    } else {
      setFloorplans([]);
    }
  }, [initialFloorplans]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    // Find the indices of the items
    const oldIndex = floorplans.findIndex(item => 
      typeof item === 'object' && item.id === active.id
    );
    
    const newIndex = floorplans.findIndex(item => 
      typeof item === 'object' && item.id === over.id
    );
    
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    
    // Update the local state immediately for a responsive UI
    const newFloorplans = arrayMove(floorplans, oldIndex, newIndex);
    setFloorplans(newFloorplans);
    
    // Update the sort_order in the database
    if (propertyId) {
      saveFloorplanOrder(newFloorplans);
    }
  };

  const saveFloorplanOrder = async (sortedFloorplans: PropertyImage[]) => {
    if (!propertyId) return;
    
    setIsSavingOrder(true);
    
    try {
      // Assign new sort_order values
      const updatedFloorplans = sortedFloorplans.map((floorplan, index) => {
        if (typeof floorplan === 'object') {
          return {
            ...floorplan,
            sort_order: index + 1
          };
        }
        return floorplan;
      });
      
      // Update each floorplan in the database
      for (const [index, floorplan] of updatedFloorplans.entries()) {
        if (typeof floorplan === 'object' && floorplan.id) {
          const { error } = await supabase
            .from('property_images')
            .update({ sort_order: index + 1 })
            .eq('id', floorplan.id)
            .eq('property_id', propertyId)
            .eq('type', 'floorplan');
            
          if (error) {
            console.error("Error updating floorplan order:", error);
            throw error;
          }
        }
      }
      
      toast.success("Floorplan order updated successfully");
    } catch (error) {
      console.error("Error saving floorplan order:", error);
      toast.error("Failed to update floorplan order");
      
      // Revert to initial floorplans if there's an error
      if (initialFloorplans && initialFloorplans.length > 0) {
        setFloorplans([...initialFloorplans]);
      }
    } finally {
      setIsSavingOrder(false);
    }
  };

  return {
    floorplans,
    setFloorplans,
    handleDragEnd,
    isSavingOrder
  };
}
