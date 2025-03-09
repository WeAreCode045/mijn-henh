
import { useState, useEffect } from "react";
import { PropertyImage } from "@/types/property";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSortableImages(
  propertyId: string | undefined,
  initialImages: PropertyImage[] = []
) {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  useEffect(() => {
    // Initialize images from props
    if (initialImages && initialImages.length > 0) {
      // Sort images by sort_order if available
      const sortedImages = [...initialImages].sort((a, b) => {
        const aOrder = typeof a === 'object' && a.sort_order ? a.sort_order : 0;
        const bOrder = typeof b === 'object' && b.sort_order ? b.sort_order : 0;
        return aOrder - bOrder;
      });
      
      setImages(sortedImages);
    } else {
      setImages([]);
    }
  }, [initialImages]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    // Find the indices of the items
    const oldIndex = images.findIndex(item => 
      typeof item === 'object' && item.id === active.id
    );
    
    const newIndex = images.findIndex(item => 
      typeof item === 'object' && item.id === over.id
    );
    
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    
    // Update the local state immediately for a responsive UI
    const newImages = arrayMove(images, oldIndex, newIndex);
    setImages(newImages);
    
    // Update the sort_order in the database
    if (propertyId) {
      saveImageOrder(newImages);
    }
  };

  const saveImageOrder = async (sortedImages: PropertyImage[]) => {
    if (!propertyId) return;
    
    setIsSavingOrder(true);
    
    try {
      // Assign new sort_order values
      const updatedImages = sortedImages.map((image, index) => {
        if (typeof image === 'object') {
          return {
            ...image,
            sort_order: index + 1
          };
        }
        return image;
      });
      
      // Update each image in the database
      for (const [index, image] of updatedImages.entries()) {
        if (typeof image === 'object' && image.id) {
          const { error } = await supabase
            .from('property_images')
            .update({ sort_order: index + 1 })
            .eq('id', image.id)
            .eq('property_id', propertyId);
            
          if (error) {
            console.error("Error updating image order:", error);
            throw error;
          }
        }
      }
      
      toast.success("Image order updated successfully");
    } catch (error) {
      console.error("Error saving image order:", error);
      toast.error("Failed to update image order");
      
      // Revert to initial images if there's an error
      if (initialImages && initialImages.length > 0) {
        setImages([...initialImages]);
      }
    } finally {
      setIsSavingOrder(false);
    }
  };

  return {
    images,
    setImages,
    handleDragEnd,
    isSavingOrder
  };
}
