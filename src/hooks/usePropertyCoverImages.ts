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
      setFormData(prevFormData => {
        // Filter main images
        const mainImages = images.filter(img => img.is_featured_image);
        
        // Convert to PropertyImage[] type
        const coverImages = mainImages.map(img => ({
          id: img.id,
          url: img.url,
          type: img.type || "image" as const
        }));

        return {
          ...prevFormData,
          coverImages,
          featuredImages: mainImages.map(img => img.url)
        };
      });
    };

    setFormData(prevFormData => {
      const updatedImages = images.map(img => {
        const imageUrl = typeof img === 'string' ? img : img.url;
        if (imageUrl === url) {
          return {
            ...img,
            is_featured_image: !isFeatured
          };
        }
        return img;
      });

      setMainImages(updatedImages as PropertyImage[]);

      return {
        ...prevFormData,
        featuredImages: updatedFeaturedImages
      };
    });
  }, [formData, setFormData]);

  return {
    handleSetFeaturedImage,
    handleToggleFeaturedImage
  };
}
