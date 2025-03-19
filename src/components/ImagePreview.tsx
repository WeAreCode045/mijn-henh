
import React from 'react';

export interface ImagePreviewProps {
  url?: string;
  src?: string; // Add support for src prop
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function ImagePreview({ url, src, alt = "Image", className = "", onClick }: ImagePreviewProps) {
  // Use src if provided, otherwise use url
  const imageSrc = src || url;
  
  return (
    <div 
      className={`relative ${className}`}
      onClick={onClick}
    >
      <img 
        src={imageSrc} 
        alt={alt} 
        className="w-full h-full object-cover rounded"
      />
    </div>
  );
}
