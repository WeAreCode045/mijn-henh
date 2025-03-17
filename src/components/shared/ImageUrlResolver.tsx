
import React from "react";
import { PropertyImage, PropertyFloorplan } from "@/types/property";

interface ImageUrlResolverProps {
  image: string | PropertyImage | PropertyFloorplan | null | undefined;
  alt?: string;
  className?: string;
  fallbackImage?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * A component that safely renders an image from various image data formats
 */
export function ImageUrlResolver({
  image,
  alt = "Image",
  className = "",
  fallbackImage = "/images/placeholder.jpg",
  onError
}: ImageUrlResolverProps) {
  const getUrl = (): string => {
    if (!image) return fallbackImage;
    if (typeof image === 'string') return image;
    return image.url || fallbackImage;
  };
  
  const getAlt = (): string => {
    if (!image || typeof image === 'string') return alt;
    return image.alt || image.title || alt;
  };
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
    if (onError) onError(e);
  };
  
  return (
    <img 
      src={getUrl()} 
      alt={getAlt()} 
      className={className}
      onError={handleError} 
    />
  );
}

/**
 * A hook to get the URL from any image type
 */
export function useImageUrl(image: string | PropertyImage | PropertyFloorplan | null | undefined): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url || null;
}
