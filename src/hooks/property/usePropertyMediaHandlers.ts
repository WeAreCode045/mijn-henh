
import { useState } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

export function usePropertyMediaHandlers(
  property: PropertyData,
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  handlers?: {
    handleVirtualTourUpdate?: (url: string) => void;
    handleYoutubeUrlUpdate?: (url: string) => void;
    handleFloorplanEmbedScriptUpdate?: (script: string) => void;
    setPendingChanges?: (pending: boolean) => void;
  }
) {
  const { uploadFile } = useFileUpload();

  // Set featured image (main image)
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // First, unmark all images as main
      const { error: resetError } = await supabase
        .from('property_images')
        .update({ is_main: false })
        .eq('property_id', property.id);
        
      if (resetError) throw resetError;
      
      if (url) {
        // Mark the selected image as main
        const { error: updateError } = await supabase
          .from('property_images')
          .update({ is_main: true })
          .eq('property_id', property.id)
          .eq('url', url);
          
        if (updateError) throw updateError;
          
        // Update local state
        setProperty(prev => ({
          ...prev,
          featuredImage: url
        }));
        
        // Call handler if provided
        if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
        
        toast.success("Main image updated successfully");
      } else {
        // If url is null, just clear the main image
        setProperty(prev => ({
          ...prev,
          featuredImage: null
        }));
        
        // Call handler if provided
        if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
        
        toast.success("Main image cleared");
      }
    } catch (error) {
      console.error("Error updating main image:", error);
      toast.error("Failed to update main image");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle featured image
  const handleToggleFeaturedImage = async (url: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      const featuredImages = property.featuredImages || [];
      const isAlreadyFeatured = featuredImages.includes(url);
      
      // Update database
      const { error } = await supabase
        .from('property_images')
        .update({ is_featured_image: !isAlreadyFeatured })
        .eq('property_id', property.id)
        .eq('url', url);
        
      if (error) throw error;
      
      // Update local state
      const newFeaturedImages = isAlreadyFeatured
        ? featuredImages.filter(img => img !== url)
        : [...featuredImages, url];
        
      setProperty(prev => ({
        ...prev,
        featuredImages: newFeaturedImages
      }));
      
      // Call handler if provided
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success(isAlreadyFeatured 
        ? "Image removed from featured images" 
        : "Image added to featured images");
    } catch (error) {
      console.error("Error toggling featured image:", error);
      toast.error("Failed to update featured images");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove image
  const handleRemoveImage = async (index: number) => {
    if (!property.id || !property.images || index < 0 || index >= property.images.length) return;
    
    setIsSaving(true);
    try {
      const imageToRemove = property.images[index];
      const imageUrl = typeof imageToRemove === 'string' ? imageToRemove : imageToRemove.url;
      const imageId = typeof imageToRemove === 'object' ? imageToRemove.id : null;
      
      // Delete from database if we have an ID
      if (imageId) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', imageId);
          
        if (error) throw error;
      } else if (imageUrl) {
        // Try to delete by URL if we don't have an ID
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', property.id)
          .eq('url', imageUrl);
          
        if (error) throw error;
      }
      
      // Update local state
      const newImages = [...property.images];
      newImages.splice(index, 1);
      
      setProperty(prev => ({
        ...prev,
        images: newImages,
        // If the removed image was the featured image, clear it
        featuredImage: prev.featuredImage === imageUrl ? null : prev.featuredImage,
        // Remove from featured images if present
        featuredImages: (prev.featuredImages || []).filter(img => img !== imageUrl)
      }));
      
      // Call handler if provided
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("Image removed");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent form submission
    
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
        // Upload file
        const publicUrl = await uploadFile(file, property.id, 'photos');
        
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
          
        if (error) throw error;
        
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
      // Reset the file input
      e.target.value = '';
    }
  };

  // Save virtual tour URL
  const handleVirtualTourSave = async (url: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // Update database - use virtualTourUrl to match the database column name
      const { error } = await supabase
        .from('properties')
        .update({ virtualTourUrl: url })
        .eq('id', property.id);
        
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        virtualTourUrl: url
      }));
      
      // Call handler if provided
      if (handlers?.handleVirtualTourUpdate) handlers.handleVirtualTourUpdate(url);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("Virtual tour URL saved");
    } catch (error) {
      console.error("Error saving virtual tour URL:", error);
      toast.error("Failed to save virtual tour URL");
    } finally {
      setIsSaving(false);
    }
  };

  // Save YouTube URL
  const handleYoutubeUrlSave = async (url: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // Update database - use youtubeUrl to match the database column name
      const { error } = await supabase
        .from('properties')
        .update({ youtubeUrl: url })
        .eq('id', property.id);
        
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        youtubeUrl: url
      }));
      
      // Call handler if provided
      if (handlers?.handleYoutubeUrlUpdate) handlers.handleYoutubeUrlUpdate(url);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("YouTube URL saved");
    } catch (error) {
      console.error("Error saving YouTube URL:", error);
      toast.error("Failed to save YouTube URL");
    } finally {
      setIsSaving(false);
    }
  };

  // Save floorplan embed script
  const handleFloorplanEmbedScriptSave = async (script: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      // Update database - use floorplanEmbedScript to match the database column name
      const { error } = await supabase
        .from('properties')
        .update({ floorplanEmbedScript: script })
        .eq('id', property.id);
        
      if (error) throw error;
      
      // Update local state
      setProperty(prev => ({
        ...prev,
        floorplanEmbedScript: script
      }));
      
      // Call handler if provided
      if (handlers?.handleFloorplanEmbedScriptUpdate) handlers.handleFloorplanEmbedScriptUpdate(script);
      if (handlers?.setPendingChanges) handlers.setPendingChanges(true);
      
      toast.success("Floorplan embed script saved");
    } catch (error) {
      console.error("Error saving floorplan embed script:", error);
      toast.error("Failed to save floorplan embed script");
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
    handleFloorplanEmbedScriptSave
  };
}
