
import { useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSortableFloorplans(propertyId: string) {
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const { toast } = useToast();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    setIsSavingOrder(true);
    
    try {
      // Get current order of images
      const { data: images } = await supabase
        .from('property_images')
        .select('id, sort_order')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan')
        .order('sort_order', { ascending: true });
      
      if (!images) return;
      
      const activeIndex = images.findIndex(img => img.id === active.id);
      const overIndex = images.findIndex(img => img.id === over.id);
      
      // Update the sort_order for the moved item
      const newSortOrder = overIndex > activeIndex 
        ? images[overIndex].sort_order 
        : images[overIndex].sort_order;
      
      await supabase
        .from('property_images')
        .update({ sort_order: newSortOrder })
        .eq('id', active.id);
      
      // Reorder all images to ensure consistent sorting
      const { data: updatedImages } = await supabase
        .from('property_images')
        .select('id')
        .eq('property_id', propertyId)
        .eq('type', 'floorplan')
        .order('sort_order', { ascending: true });
      
      if (updatedImages) {
        for (let i = 0; i < updatedImages.length; i++) {
          await supabase
            .from('property_images')
            .update({ sort_order: i * 10 })
            .eq('id', updatedImages[i].id);
        }
      }
      
      toast({
        title: "Order updated",
        description: "The floorplan order has been saved",
      });
    } catch (error) {
      console.error("Error updating floorplan order:", error);
      toast({
        title: "Error",
        description: "Failed to update floorplan order",
        variant: "destructive",
      });
    } finally {
      setIsSavingOrder(false);
    }
  };

  return {
    handleDragEnd,
    isSavingOrder
  };
}
