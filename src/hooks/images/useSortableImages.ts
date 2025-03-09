
import { useState } from "react";
import { PropertyImage } from "@/types/property";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSortableImages(images: PropertyImage[], propertyId: string) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [sortedImages, setSortedImages] = useState<PropertyImage[]>(images);
  const [isSaving, setIsSaving] = useState(false);

  // Update sorted images when images prop changes
  useState(() => {
    setSortedImages(images);
  });

  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sortedImages.findIndex(item => item.id === active.id);
      const newIndex = sortedImages.findIndex(item => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newSortedImages = arrayMove(sortedImages, oldIndex, newIndex);

      // Update local state immediately for better UX
      setSortedImages(newSortedImages);

      // Only update in database if we have a propertyId
      if (propertyId) {
        setIsSaving(true);
        
        try {
          // Update sort_order for each image in the database
          const updates = newSortedImages.map((image, index) => {
            // Make sure we're using string IDs consistently
            const imageId = typeof image.id === 'number' ? String(image.id) : image.id;
            
            return supabase
              .from('property_images')
              .update({ sort_order: index })
              .eq('id', imageId);
          });

          await Promise.all(updates);
          toast.success("Image order updated successfully");
        } catch (error) {
          console.error("Error updating image order:", error);
          toast.error("Failed to update image order");
          // Revert to original order on error
          setSortedImages(images);
        } finally {
          setIsSaving(false);
        }
      }
    }

    setActiveId(null);
  };

  return {
    activeId,
    sortedImages,
    isSaving,
    handleDragStart,
    handleDragEnd
  };
}
