
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSortableFloorplans(floorplans: PropertyImage[], propertyId: string) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [sortedFloorplans, setSortedFloorplans] = useState<PropertyImage[]>(floorplans);
  const [isSaving, setIsSaving] = useState(false);

  // Update sorted floorplans when floorplans prop changes
  useState(() => {
    setSortedFloorplans(floorplans);
  });

  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sortedFloorplans.findIndex(item => item.id === active.id);
      const newIndex = sortedFloorplans.findIndex(item => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newSortedFloorplans = arrayMove(sortedFloorplans, oldIndex, newIndex);

      // Update local state immediately for better UX
      setSortedFloorplans(newSortedFloorplans);

      // Only update in database if we have a propertyId
      if (propertyId) {
        setIsSaving(true);
        
        try {
          // Update sort_order for each floorplan in the database
          const updates = newSortedFloorplans.map((floorplan, index) => {
            // Make sure we're using string IDs consistently
            const floorplanId = typeof floorplan.id === 'number' ? String(floorplan.id) : floorplan.id;
            
            return supabase
              .from('property_images')
              .update({ sort_order: index })
              .eq('id', floorplanId);
          });

          await Promise.all(updates);
          toast.success("Floorplan order updated successfully");
        } catch (error) {
          console.error("Error updating floorplan order:", error);
          toast.error("Failed to update floorplan order");
          // Revert to original order on error
          setSortedFloorplans(floorplans);
        } finally {
          setIsSaving(false);
        }
      }
    }

    setActiveId(null);
  };

  return {
    activeId,
    sortedFloorplans,
    isSaving,
    handleDragStart,
    handleDragEnd
  };
}
