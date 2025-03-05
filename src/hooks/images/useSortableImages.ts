
import { useState, useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useSortableImages(
  images: PropertyImage[] = [],
  propertyId?: string
) {
  const [sortableImages, setSortableImages] = useState<PropertyImage[]>([]);
  const { toast } = useToast();

  // Initialize and update sortable images when input images change
  useEffect(() => {
    if (images && images.length > 0) {
      const sortedImages = [...images].sort((a, b) => {
        if (a.sort_order !== undefined && b.sort_order !== undefined) {
          return a.sort_order - b.sort_order;
        }
        return 0;
      });
      
      setSortableImages(sortedImages);
      console.log("useSortableImages - Updated with sorted images:", sortedImages);
    } else {
      setSortableImages([]);
    }
  }, [images]);

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSortableImages((items) => {
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
          updateImageSortOrderInDatabase(updatedItems);
        }
        
        return updatedItems;
      });
    }
  };

  // Update image sort order in the database
  const updateImageSortOrderInDatabase = async (images: PropertyImage[]) => {
    if (!propertyId) return;
    
    try {
      console.log('Updating image sort order in database...');
      
      // Create an array of promises for each update operation
      const updatePromises = images.map((image, index) => {
        // Skip images without a valid database ID
        if (!image.id || typeof image.id !== 'string' || image.id.startsWith('temp-')) {
          console.log('Skipping image without valid ID:', image);
          return Promise.resolve();
        }
        
        console.log(`Setting image ${image.id} to sort_order ${index + 1}`);
        
        return supabase
          .from('property_images')
          .update({ sort_order: index + 1 }) // 1-based index for sort_order
          .eq('id', image.id);
      });
      
      // Execute all update operations in parallel
      await Promise.all(updatePromises);
      console.log('Image sort order updated successfully');
      
      toast({
        title: "Order updated",
        description: "Image order has been saved",
      });
    } catch (error) {
      console.error('Error updating image sort order:', error);
      
      toast({
        title: "Error",
        description: "Failed to save image order",
        variant: "destructive",
      });
    }
  };

  return {
    sortableImages,
    handleDragEnd
  };
}
