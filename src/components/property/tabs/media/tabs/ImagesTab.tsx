
import React from "react";
import { PropertyData } from "@/types/property";
import { PropertyImagesCard } from "../PropertyImagesCard";

interface ImagesTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ImagesTab({
  property,
  setProperty,
  isSaving,
  setIsSaving
}: ImagesTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !property.id) return;
    
    setIsUploading(true);
    
    try {
      console.log("Uploading images...");
      // Simulating successful upload
      const newImages = Array.from(e.target.files).map(file => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        type: "image" as const
      }));
      
      // Update the property with new images
      setProperty(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
      
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };
  
  const handleRemoveImage = (index: number) => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property by removing the image at the specified index
      setProperty(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      
    } catch (error) {
      console.error("Error removing image:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSetFeaturedImage = (url: string | null) => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property with the new featured image
      setProperty(prev => ({
        ...prev,
        featuredImage: url
      }));
      
    } catch (error) {
      console.error("Error setting featured image:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleToggleFeaturedImage = (url: string) => {
    if (!property.id) return;
    
    const isFeatured = property.featuredImage === url;
    handleSetFeaturedImage(isFeatured ? null : url);
  };

  return (
    <PropertyImagesCard
      images={property.images || []}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      isUploading={isUploading}
      onSetFeaturedImage={handleSetFeaturedImage}
      onToggleFeaturedImage={handleToggleFeaturedImage}
      featuredImage={property.featuredImage}
      propertyId={property.id}
    />
  );
}

// Add missing import
import { useState } from "react";
