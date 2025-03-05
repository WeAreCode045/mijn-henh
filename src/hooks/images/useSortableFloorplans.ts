
import { useState, useEffect } from "react";
import { PropertyFloorplan } from "@/types/property";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSortableFloorplans(
  floorplans: PropertyFloorplan[] = [],
  propertyId?: string
) {
  const [sortableFloorplans, setSortableFloorplans] = useState<PropertyFloorplan[]>([]);
  const { toast } = useToast();

  // Initialize and update sortable floorplans when input floorplans change
  useEffect(() => {
    if (floorplans && floorplans.length > 0) {
      const sortedFloorplans = [...floorplans].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      
      setSortableFloorplans(sortedFloorplans);
      console.log("useSortableFloorplans - Updated with sorted floorplans:", sortedFloorplans);
    } else {
      setSortableFloorplans([]);
    }
  }, [floorplans]);

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSortableFloorplans((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update each item with a new sort_order based on its position
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          sort_order: index + 1 // 1-based indexing for sort_order
        }));
        
        // Update sort_order in the database
        if (propertyId) {
          updateFloorplanSortOrderInDatabase(updatedItems);
        }
        
        return updatedItems;
      });
    }
  };

  // Update floorplan sort order in the database
  const updateFloorplanSortOrderInDatabase = async (floorplans: PropertyFloorplan[]) => {
    if (!propertyId) return;
    
    try {
      console.log('Updating floorplan sort order in database...');
      
      // Create an array of promises for each update operation
      const updatePromises = floorplans.map((floorplan, index) => {
        // Skip floorplans without a valid database ID
        if (!floorplan.id || typeof floorplan.id !== 'string' || floorplan.id.startsWith('temp-')) {
          console.log('Skipping floorplan without valid ID:', floorplan);
          return Promise.resolve();
        }
        
        console.log(`Setting floorplan ${floorplan.id} to sort_order ${index + 1}`);
        
        return supabase
          .from('property_images')
          .update({ sort_order: index + 1 }) // 1-based index for sort_order
          .eq('id', floorplan.id)
          .eq('property_id', propertyId)
          .eq('type', 'floorplan');
      });
      
      // Execute all update operations in parallel
      await Promise.all(updatePromises);
      console.log('Floorplan sort order updated successfully');
      
      toast({
        title: "Order updated",
        description: "Floorplan order has been saved",
      });
    } catch (error) {
      console.error('Error updating floorplan sort order:', error);
      
      toast({
        title: "Error",
        description: "Failed to save floorplan order",
        variant: "destructive",
      });
    }
  };

  return {
    sortableFloorplans,
    handleDragEnd
  };
}
