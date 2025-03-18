
import { useState, useCallback } from "react";
import { PropertyFormData, PropertyImage } from "@/types/property";

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
    const isFeatured = formData.featuredImages?.includes(url);
    let updatedFeaturedImages: string[];

    if (isFeatured) {
      updatedFeaturedImages = formData.featuredImages!.filter(featuredUrl => featuredUrl !== url);
    } else {
      updatedFeaturedImages = [...(formData.featuredImages || []), url];
    }

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
      updatedFormData.featuredImages = mainImages.map(img => img.url);
      
      setFormData(updatedFormData);
    };

    const updatedFormData: PropertyFormData = { ...formData };
    
    const updatedImages = images.map(img => {
      const imageUrl = typeof img === 'string' ? img : img.url;
      if (imageUrl === url) {
        return {
          ...img,
          is_featured_image: !isFeatured
        };
      }
      return img;
    }) as PropertyImage[];

    updatedFormData.images = updatedImages;
    updatedFormData.featuredImages = updatedFeaturedImages;
    
    setMainImages(updatedImages);
    
    setFormData(updatedFormData);
  }, [formData, setFormData]);

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage
  };
}
