import { useState } from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export function usePropertyMediaHandlers(
  propertyId: string,
  property: PropertyData,
  onUpdate: (field: keyof PropertyData, value: any) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFloorplan, setIsUploadingFloorplan] = useState(false);

  // Helper to get URL from either PropertyImage or string
  const getImageUrl = (image: PropertyImage | string): string => {
    if (typeof image === 'string') {
      return image;
    }
    return image.url;
  };

  // Handle image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const files = Array.from(e.target.files);
    const newImages: PropertyImage[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `properties/${propertyId}/images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (urlData) {
          const newImage: PropertyImage = {
            id: uuidv4(),
            url: urlData.publicUrl,
            property_id: propertyId,
            is_main: false,
            is_featured_image: false,
            type: 'image'
          };

          newImages.push(newImage);

          // Save to property_images table
          const { error: dbError } = await supabase
            .from('property_images')
            .insert({
              id: newImage.id,
              property_id: propertyId,
              url: newImage.url,
              is_main: false,
              is_featured_image: false,
              type: 'image'
            });

          if (dbError) {
            console.error('Error saving image to database:', dbError);
          }
        }
      }

      // Update the property state with new images
      const currentImages = property.images || [];
      const updatedImages = [...currentImages, ...newImages];
      onUpdate('images', updatedImages);

    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Handle removing images
  const handleRemoveImage = async (index: number) => {
    if (!property.images || index >= property.images.length) {
      return;
    }

    try {
      const imageToRemove = property.images[index];
      const imageId = typeof imageToRemove === 'string' ? null : imageToRemove.id;

      // Remove from database if we have an ID
      if (imageId) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', imageId);

        if (error) {
          console.error('Error removing image from database:', error);
        }
      }

      // Update the property state
      const updatedImages = [...property.images];
      updatedImages.splice(index, 1);
      onUpdate('images', updatedImages);

    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  // Handle floorplan uploads
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploadingFloorplan(true);
    const files = Array.from(e.target.files);
    const newFloorplans: PropertyImage[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `properties/${propertyId}/floorplans/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (urlData) {
          const newFloorplan: PropertyImage = {
            id: uuidv4(),
            url: urlData.publicUrl,
            property_id: propertyId,
            type: 'floorplan'
          };

          newFloorplans.push(newFloorplan);

          // Save to property_images table
          const { error: dbError } = await supabase
            .from('property_images')
            .insert({
              id: newFloorplan.id,
              property_id: propertyId,
              url: newFloorplan.url,
              type: 'floorplan'
            });

          if (dbError) {
            console.error('Error saving floorplan to database:', dbError);
          }
        }
      }

      // Update the property state with new floorplans
      const currentFloorplans = property.floorplans || [];
      const updatedFloorplans = [...currentFloorplans, ...newFloorplans];
      onUpdate('floorplans', updatedFloorplans);

    } catch (error) {
      console.error('Error uploading floorplans:', error);
    } finally {
      setIsUploadingFloorplan(false);
      e.target.value = '';
    }
  };

  // Handle removing floorplans
  const handleRemoveFloorplan = async (index: number) => {
    if (!property.floorplans || index >= property.floorplans.length) {
      return;
    }

    try {
      const floorplanToRemove = property.floorplans[index];
      const floorplanId = typeof floorplanToRemove === 'string' ? null : floorplanToRemove.id;

      // Remove from database if we have an ID
      if (floorplanId) {
        const { error } = await supabase
          .from('property_images')
          .delete()
          .eq('id', floorplanId);

        if (error) {
          console.error('Error removing floorplan from database:', error);
        }
      }

      // Update the property state
      const updatedFloorplans = [...property.floorplans];
      updatedFloorplans.splice(index, 1);
      onUpdate('floorplans', updatedFloorplans);

    } catch (error) {
      console.error('Error removing floorplan:', error);
    }
  };

  // Handle setting featured image
  const handleSetFeaturedImage = async (url: string | null) => {
    if (!property.images) {
      return;
    }

    try {
      // Update all images to not be main
      if (url) {
        await supabase
          .from('property_images')
          .update({ is_main: false })
          .eq('property_id', propertyId);

        // Find the image with the matching URL and set it as main
        const imageToUpdate = property.images.find(img => {
          const imgUrl = typeof img === 'string' ? img : img.url;
          return imgUrl === url;
        });

        if (imageToUpdate && typeof imageToUpdate !== 'string') {
          await supabase
            .from('property_images')
            .update({ is_main: true })
            .eq('id', imageToUpdate.id);
        }
      }

      // Update the property state
      onUpdate('featuredImage', url);

    } catch (error) {
      console.error('Error setting featured image:', error);
    }
  };

  // Handle toggling featured image
  const handleToggleFeaturedImage = async (url: string) => {
    if (!property.images) {
      return;
    }

    try {
      const featuredImages = property.featuredImages || [];
      const isAlreadyFeatured = featuredImages.includes(url);
      let updatedFeaturedImages: string[];

      if (isAlreadyFeatured) {
        // Remove from featured images
        updatedFeaturedImages = featuredImages.filter(img => img !== url);
      } else {
        // Add to featured images
        updatedFeaturedImages = [...featuredImages, url];
      }

      // Find the image with the matching URL
      const imageToUpdate = property.images.find(img => {
        const imgUrl = typeof img === 'string' ? img : img.url;
        return imgUrl === url;
      });

      if (imageToUpdate && typeof imageToUpdate !== 'string') {
        await supabase
          .from('property_images')
          .update({ is_featured_image: !isAlreadyFeatured })
          .eq('id', imageToUpdate.id);
      }

      // Update the property state
      onUpdate('featuredImages', updatedFeaturedImages);

    } catch (error) {
      console.error('Error toggling featured image:', error);
    }
  };

  // Handle updating virtual tour URL
  const handleVirtualTourUpdate = (url: string) => {
    if (url !== property.virtualTourUrl) {
      onUpdate('virtualTourUrl', url);
    }
  };

  // Handle updating YouTube URL
  const handleYoutubeUrlUpdate = (url: string) => {
    if (url !== property.youtubeUrl) {
      onUpdate('youtubeUrl', url);
    }
  };

  // Handle updating floorplan embed script
  const handleFloorplanEmbedScriptUpdate = (script: string) => {
    if (script !== property.floorplanEmbedScript) {
      onUpdate('floorplanEmbedScript', script);
      
      // Save to database if we have a property ID
      if (propertyId) {
        supabase
          .from('properties')
          .update({ floorplanEmbedScript: script })
          .eq('id', propertyId)
          .then(({ error }) => {
            if (error) {
              console.error('Error saving floorplan embed script:', error);
            }
          });
      }
    }
  };

  return {
    isUploading,
    isUploadingFloorplan,
    handleImageUpload,
    handleRemoveImage,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    handleVirtualTourUpdate,
    handleYoutubeUrlUpdate,
    handleFloorplanEmbedScriptUpdate
  };
}
