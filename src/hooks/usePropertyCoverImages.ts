
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";
import { convertToPropertyImageArray } from "@/utils/propertyDataAdapters";
import { toPropertyImage } from "@/utils/imageTypeConverters";

export function usePropertyCoverImages(
  formData: PropertyFormData,
  setFormData: (data: PropertyFormData) => void
) {
  // Set featured image
  const handleSetFeaturedImage = useCallback((url: string | null) => {
    setFormData({
      ...formData,
      featuredImage: url
    });
  }, [formData, setFormData]);

  // Toggle featured image
  const handleToggleFeaturedImage = useCallback((url: string) => {
    // Check if the image is already featured
    const isFeatured = formData.featuredImages?.some(img => 
      typeof img === 'string' ? img === url : img.url === url
    );

    // Get all images
    const images = Array.isArray(formData.images) ? formData.images : [];

    // Set main images
    const setMainImages = (images: PropertyImage[]) => {
      const updatedFormData: PropertyFormData = { ...formData };
      
      // Filter main images
      const mainImages = images.filter(img => img.is_featured_image);
      
      // Convert to PropertyImage[] type
      const coverImages = mainImages.map(img => ({
        id: img.id,
        url: img.url,
        type: img.type || "image" as const
      })) as PropertyImage[];

      updatedFormData.coverImages = coverImages;
      updatedFormData.featuredImages = mainImages;
      
      setFormData(updatedFormData);
    };

    const updatedFormData: PropertyFormData = { ...formData };
    
    const updatedImages = images.map(img => {
      const imageUrl = typeof img === 'string' ? img : img.url;
      if (imageUrl === url) {
        return {
          ...toPropertyImage(imageUrl), // Fixed: Now properly pass the URL string instead of the whole image object
          is_featured_image: !isFeatured
        };
      }
      return typeof img === 'string' ? toPropertyImage(img) : img;
    });

    updatedFormData.images = updatedImages;
    
    // Update featured images list based on the is_featured_image flag
    updatedFormData.featuredImages = updatedImages.filter(img => img.is_featured_image);
    
    setMainImages(updatedImages);
    
    setFormData(updatedFormData);
  }, [formData, setFormData]);

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage
  };
}
