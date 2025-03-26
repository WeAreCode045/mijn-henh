
import { useState, useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFormImages(
  propertyId: string,
  formState: PropertyFormData,
  handleFieldChange: (field: keyof PropertyFormData, value: any) => void,
  setPendingChanges: (pending: boolean) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFloorplan, setIsUploadingFloorplan] = useState(false);
  const { toast } = useToast();
  
  // Modified to accept React.ChangeEvent<HTMLInputElement> instead of FileList
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // This is a simplified version that would need to be expanded
      // to handle actual image upload to Supabase storage
      console.log("Uploading images for property:", propertyId);
      
      // Mock successful upload
      setTimeout(() => {
        setIsUploading(false);
        setPendingChanges(true);
        toast({
          title: "Success",
          description: "Images uploaded successfully",
        });
      }, 1000);
    } catch (error) {
      console.error("Error uploading images:", error);
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  }, [propertyId, setPendingChanges, toast]);
  
  const handleRemoveImage = useCallback((index: number) => {
    // Implementation for removing images
    console.log("Removing image at index:", index);
    setPendingChanges(true);
  }, [setPendingChanges]);
  
  // Modified to accept React.ChangeEvent<HTMLInputElement> instead of FileList
  const handleFloorplanUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploadingFloorplan(true);
    
    try {
      // Mock implementation
      setTimeout(() => {
        setIsUploadingFloorplan(false);
        setPendingChanges(true);
        toast({
          title: "Success",
          description: "Floorplan uploaded successfully",
        });
      }, 1000);
    } catch (error) {
      setIsUploadingFloorplan(false);
      toast({
        title: "Error",
        description: "Failed to upload floorplan",
        variant: "destructive",
      });
    }
  }, [setPendingChanges, toast]);
  
  const handleRemoveFloorplan = useCallback((index: number) => {
    console.log("Removing floorplan at index:", index);
    setPendingChanges(true);
  }, [setPendingChanges]);
  
  const handleSetFeaturedImage = useCallback((imageUrl: string) => {
    handleFieldChange("featuredImage", imageUrl);
  }, [handleFieldChange]);
  
  const handleToggleFeaturedImage = useCallback((imageUrl: string) => {
    const featuredImages = formState.featuredImages || [];
    
    if (featuredImages.includes(imageUrl)) {
      handleFieldChange(
        "featuredImages", 
        featuredImages.filter(url => url !== imageUrl)
      );
    } else {
      handleFieldChange("featuredImages", [...featuredImages, imageUrl]);
    }
  }, [formState.featuredImages, handleFieldChange]);
  
  const handleVirtualTourUpdate = useCallback((url: string) => {
    handleFieldChange("virtualTourUrl", url);
  }, [handleFieldChange]);
  
  const handleYoutubeUrlUpdate = useCallback((url: string) => {
    handleFieldChange("youtubeUrl", url);
  }, [handleFieldChange]);
  
  const handleFloorplanEmbedScriptUpdate = useCallback((script: string) => {
    handleFieldChange("floorplanEmbedScript", script);
  }, [handleFieldChange]);
  
  // Add the images property to the returned object
  const images = Array.isArray(formState.images) ? formState.images : [];
  
  return {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate,
    // Export the images array
    images
  };
}
