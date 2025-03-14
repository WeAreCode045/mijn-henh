
import { PropertyData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

/**
 * Hook for uploading images to a property
 */
export function useUploadImage(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  const { uploadFile } = useFileUpload();

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent default behavior
    e.preventDefault();
    
    if (!e.target.files || e.target.files.length === 0 || !property.id) {
      return;
    }
    
    setIsSaving(true);
    const files = Array.from(e.target.files);
    const newImages: PropertyImage[] = [];
    
    try {
      // Find the highest sort_order for existing images
      let highestSortOrder = 0;
      property.images?.forEach(img => {
        if (typeof img === 'object' && img.sort_order && img.sort_order > highestSortOrder) {
          highestSortOrder = img.sort_order;
        }
      });
      
      // Process each file
      for (const file of files) {
        console.log(`Uploading file: ${file.name}, size: ${file.size}`);
        
        // Upload file
        const publicUrl = await uploadFile(file, property.id, 'photos');
        console.log(`File uploaded, public URL: ${publicUrl}`);
        
        // Increment sort order
        highestSortOrder += 1;
        
        // Create database record
        const { error, data } = await supabase
          .from('property_images')
          .insert({
            property_id: property.id,
            url: publicUrl,
            type: 'image',
            sort_order: highestSortOrder
          })
          .select()
          .single();
          
        if (error) {
          console.error("Database error:", error);
          throw error;
        }
        
        console.log(`Database record created, ID: ${data.id}`);
        
        // Add to new images array
        newImages.push({
          id: data.id,
          url: publicUrl,
          type: 'image',
          sort_order: highestSortOrder,
          is_main: false,
          is_featured_image: false
        });
      }
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
      
      // Call handler if provided
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success(`${newImages.length} image${newImages.length !== 1 ? 's' : ''} uploaded`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsSaving(false);
      // Reset the file input if it's a standard input element
      if (e.target.value !== undefined) {
        e.target.value = '';
      }
    }
  };

  return { handleImageUpload };
}
