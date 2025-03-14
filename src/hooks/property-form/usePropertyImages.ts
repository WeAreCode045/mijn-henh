
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFormData, PropertyImage } from '@/types/property';

export function usePropertyImages(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Convert any image format to a standard PropertyImage array
  const normalizeImages = useCallback((images: any[] | undefined): PropertyImage[] => {
    if (!images) return [];
    
    return images.map(img => {
      if (typeof img === 'string') {
        return { id: uuidv4(), url: img };
      } else if (typeof img === 'object') {
        if ('url' in img) {
          return { id: img.id || uuidv4(), url: img.url };
        }
      }
      return { id: uuidv4(), url: '' };
    });
  }, []);
  
  // Get normalized images
  const images = normalizeImages(formData.images as any[]);
  
  // Handle image upload
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // In a real implementation, you would upload the files to your server
      // For now, we'll just simulate the upload
      const uploadedImageUrls = Array.from(e.target.files).map((file, index) => ({
        id: `temp_${uuidv4()}`,
        url: URL.createObjectURL(file)
      }));
      
      // Add the uploaded images to the property
      const currentImages = normalizeImages(formData.images as any[]);
      const updatedImages = [...currentImages, ...uploadedImageUrls];
      
      onFieldChange('images', updatedImages);
    } finally {
      setIsUploading(false);
    }
  }, [formData.images, normalizeImages, onFieldChange]);
  
  // Remove an image
  const handleRemoveImage = useCallback((index: number) => {
    const currentImages = normalizeImages(formData.images as any[]);
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    
    onFieldChange('images', updatedImages);
  }, [formData.images, normalizeImages, onFieldChange]);
  
  return {
    images,
    handleImageUpload,
    handleRemoveImage,
    isUploading
  };
}
