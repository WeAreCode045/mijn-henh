
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyFormData, PropertyImage } from "@/types/property";

export function useImageUploadHandler(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void,
  setIsUploading: (isUploading: boolean) => void
) {
  const { toast } = useToast();

  // This function handles file uploads for main property images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Sanitize the file name to remove non-ASCII characters
        const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '');
        
        // Create a unique file name with UUID to prevent collisions
        const fileName = `${crypto.randomUUID()}-${sanitizedFileName}`;
        
        // Define the file path in the storage bucket - Using media subfolder
        const filePath = `properties/${formData.id || 'new'}/media/${fileName}`;
        
        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);
          
        // Return a new PropertyImage object
        return {
          id: crypto.randomUUID(),
          url: publicUrl,
          filePath // Store the file path for potential deletion later
        };
      });
      
      // Wait for all uploads to complete
      const newImages = await Promise.all(uploadPromises);
      
      // Create a new array with all existing and new images
      // Ensure images is an array even if it's not defined in formData
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      const updatedImages = [...currentImages, ...newImages];
      
      // Log for debugging
      console.log("Previous images:", currentImages);
      console.log("New images:", newImages);
      console.log("Updated images:", updatedImages);
      
      // Create a completely new object for React state detection
      const updatedFormData = {
        ...formData,
        images: updatedImages
      };
      
      // Update form state
      setFormData(updatedFormData);
      
      // If the property is already saved in the database, update it immediately
      if (formData.id) {
        try {
          // Add images to the property_images table for tracking
          for (const image of newImages) {
            const { error } = await supabase
              .from('property_images')
              .insert({
                property_id: formData.id,
                url: image.url,
                type: 'image' // Set type as 'image' to distinguish from floorplans
              });
              
            if (error) {
              console.error('Error adding image to database:', error);
            }
          }
        } catch (error) {
          console.error('Exception updating images in database:', error);
        }
      }
      
      toast({
        title: "Success",
        description: `${newImages.length} image${newImages.length === 1 ? '' : 's'} uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { handleImageUpload };
}
