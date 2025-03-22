
import { useState } from 'react';
import { PropertyData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface PropertyMediaHandlersProps {
  handleVirtualTourUpdate?: (url: string) => void;
  handleYoutubeUrlUpdate?: (url: string) => void;
  handleFloorplanEmbedScriptUpdate?: (script: string) => void;
}

export function usePropertyMediaHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: PropertyMediaHandlersProps
) {
  const { toast } = useToast();
  const [isUploadingFloorplan, setIsUploadingFloorplan] = useState(false);
  
  // For property updates that need to be saved to the database
  const updateProperty = async (field: string, value: any) => {
    // Don't save if no property id
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ [field]: value })
        .eq('id', property.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${field.replace('_', ' ')} updated successfully`,
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${field.replace('_', ' ')}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsSaving(true);
    
    try {
      const newImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${property.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);
          
        if (data) {
          newImages.push({
            id: filePath,
            url: data.publicUrl
          });
        }
      }
      
      // Add new images to existing ones
      const updatedImages = [...(property.images || []), ...newImages];
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        images: updatedImages
      }));
      
      // Save to database
      await updateProperty('images', updatedImages);
      
      toast({
        title: "Success",
        description: `${newImages.length} images uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      // Reset file input
      e.target.value = '';
    }
  };
  
  // Handle removing images
  const handleRemoveImage = async (index: number) => {
    if (!property.images || !property.images[index]) return;
    
    setIsSaving(true);
    
    try {
      const imageToRemove = property.images[index];
      
      // If the image is the featured image, reset it
      let featuredImageUpdate = null;
      if (property.featuredImage === imageToRemove.url) {
        featuredImageUpdate = null;
      }
      
      // If the image is in featuredImages, remove it
      let featuredImagesUpdate = [...(property.featuredImages || [])];
      if (featuredImagesUpdate.includes(imageToRemove.url)) {
        featuredImagesUpdate = featuredImagesUpdate.filter(url => url !== imageToRemove.url);
      }
      
      // Remove from storage if the image has an id that looks like a path
      if (typeof imageToRemove.id === 'string' && imageToRemove.id.includes('/')) {
        const { error: deleteError } = await supabase.storage
          .from('property-images')
          .remove([imageToRemove.id]);
          
        if (deleteError) console.error('Error deleting image from storage:', deleteError);
      }
      
      // Update images array
      const updatedImages = [...property.images];
      updatedImages.splice(index, 1);
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        images: updatedImages,
        ...(featuredImageUpdate !== null && { featuredImage: featuredImageUpdate }),
        ...(featuredImagesUpdate && { featuredImages: featuredImagesUpdate })
      }));
      
      // Save to database
      await updateProperty('images', updatedImages);
      if (featuredImageUpdate !== null) {
        await updateProperty('featuredImage', featuredImageUpdate);
      }
      if (featuredImagesUpdate) {
        await updateProperty('featuredImages', featuredImagesUpdate);
      }
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle setting a featured image (main image)
  const handleSetFeaturedImage = async (url: string | null) => {
    setIsSaving(true);
    
    try {
      // Update local state
      setProperty(prev => ({
        ...prev,
        featuredImage: url
      }));
      
      // Save to database
      await updateProperty('featuredImage', url);
      
      toast({
        title: "Success",
        description: url ? "Main image set successfully" : "Main image removed",
      });
    } catch (error) {
      console.error('Error setting featured image:', error);
      toast({
        title: "Error",
        description: "Failed to set main image",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle toggling an image as featured (for the gallery)
  const handleToggleFeaturedImage = async (url: string) => {
    setIsSaving(true);
    
    try {
      const featuredImages = [...(property.featuredImages || [])];
      
      if (featuredImages.includes(url)) {
        // Remove from featured
        const updatedFeaturedImages = featuredImages.filter(image => image !== url);
        
        // Update local state
        setProperty(prev => ({
          ...prev,
          featuredImages: updatedFeaturedImages
        }));
        
        // Save to database
        await updateProperty('featuredImages', updatedFeaturedImages);
        
        toast({
          title: "Success",
          description: "Image removed from featured",
        });
      } else {
        // Add to featured (max 4)
        if (featuredImages.length >= 4) {
          toast({
            title: "Warning",
            description: "You can only have 4 featured images",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
        
        const updatedFeaturedImages = [...featuredImages, url];
        
        // Update local state
        setProperty(prev => ({
          ...prev,
          featuredImages: updatedFeaturedImages
        }));
        
        // Save to database
        await updateProperty('featuredImages', updatedFeaturedImages);
        
        toast({
          title: "Success",
          description: "Image added to featured",
        });
      }
    } catch (error) {
      console.error('Error toggling featured image:', error);
      toast({
        title: "Error",
        description: "Failed to update featured images",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving virtual tour URL
  const handleVirtualTourSave = async (url: string) => {
    setIsSaving(true);
    
    try {
      // Update local state
      setProperty(prev => ({
        ...prev,
        virtualTourUrl: url
      }));
      
      // Save to database
      await updateProperty('virtualTourUrl', url);
      
      // Call the handler if provided
      if (handlers?.handleVirtualTourUpdate) {
        handlers.handleVirtualTourUpdate(url);
      }
      
      toast({
        title: "Success",
        description: "Virtual tour URL saved successfully",
      });
    } catch (error) {
      console.error('Error saving virtual tour URL:', error);
      toast({
        title: "Error",
        description: "Failed to save virtual tour URL",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving YouTube URL
  const handleYoutubeUrlSave = async (url: string) => {
    setIsSaving(true);
    
    try {
      // Update local state
      setProperty(prev => ({
        ...prev,
        youtubeUrl: url
      }));
      
      // Save to database
      await updateProperty('youtubeUrl', url);
      
      // Call the handler if provided
      if (handlers?.handleYoutubeUrlUpdate) {
        handlers.handleYoutubeUrlUpdate(url);
      }
      
      toast({
        title: "Success",
        description: "YouTube URL saved successfully",
      });
    } catch (error) {
      console.error('Error saving YouTube URL:', error);
      toast({
        title: "Error",
        description: "Failed to save YouTube URL",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving floorplan embed script
  const handleFloorplanEmbedScriptSave = async (script: string) => {
    setIsSaving(true);
    
    try {
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplanEmbedScript: script
      }));
      
      // Save to database
      await updateProperty('floorplanEmbedScript', script);
      
      // Call the handler if provided
      if (handlers?.handleFloorplanEmbedScriptUpdate) {
        handlers.handleFloorplanEmbedScriptUpdate(script);
      }
      
      toast({
        title: "Success",
        description: "Floorplan embed script saved successfully",
      });
    } catch (error) {
      console.error('Error saving floorplan embed script:', error);
      toast({
        title: "Error",
        description: "Failed to save floorplan embed script",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle floorplan upload
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploadingFloorplan(true);
    
    try {
      const newFloorplans = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `floorplan-${uuidv4()}.${fileExt}`;
        const filePath = `${property.id}/floorplans/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);
          
        if (data) {
          newFloorplans.push(data.publicUrl);
        }
      }
      
      // Add new floorplans to existing ones
      const updatedFloorplans = [...(property.floorplans || []), ...newFloorplans];
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplans: updatedFloorplans
      }));
      
      // Save to database
      await updateProperty('floorplans', updatedFloorplans);
      
      toast({
        title: "Success",
        description: `${newFloorplans.length} floorplans uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading floorplans:', error);
      toast({
        title: "Error",
        description: "Failed to upload floorplans",
        variant: "destructive",
      });
    } finally {
      setIsUploadingFloorplan(false);
      // Reset file input
      e.target.value = '';
    }
  };
  
  // Handle removing floorplans
  const handleRemoveFloorplan = async (index: number) => {
    if (!property.floorplans || !property.floorplans[index]) return;
    
    setIsSaving(true);
    
    try {
      // Get the floorplan URL
      const floorplanUrl = property.floorplans[index];
      
      // Extract the path from the URL
      const urlParts = floorplanUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const storagePath = `${property.id}/floorplans/${fileName}`;
      
      // Try to remove from storage
      try {
        await supabase.storage
          .from('property-images')
          .remove([storagePath]);
      } catch (storageError) {
        console.error('Error removing floorplan from storage:', storageError);
        // Continue even if storage removal fails
      }
      
      // Update floorplans array
      const updatedFloorplans = [...property.floorplans];
      updatedFloorplans.splice(index, 1);
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplans: updatedFloorplans
      }));
      
      // Save to database
      await updateProperty('floorplans', updatedFloorplans);
      
      toast({
        title: "Success",
        description: "Floorplan removed successfully",
      });
    } catch (error) {
      console.error('Error removing floorplan:', error);
      toast({
        title: "Error",
        description: "Failed to remove floorplan",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleRemoveImage,
    handleImageUpload,
    handleVirtualTourSave,
    handleYoutubeUrlSave,
    handleFloorplanEmbedScriptSave,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  };
}
