
import { useState } from "react";

export interface AreaImageSliderProps {
  images: string[];
  areaTitle?: string;
}

export function AreaImageSlider({ images, areaTitle = "Area" }: AreaImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No images available for this area</p>
      </div>
    );
  }

  return (
    <div className="area-image-slider">
      {/* Main image */}
      <div 
        className="main-image-container relative aspect-[4/3] rounded-lg overflow-hidden mb-2 cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <img 
          src={images[currentImageIndex]} 
          alt={`${areaTitle} - Main view`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="thumbnails-container grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`thumbnail aspect-[4/3] rounded-md overflow-hidden cursor-pointer border-2 ${
                index === currentImageIndex ? 'border-estate-600' : 'border-transparent'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={image} 
                alt={`${areaTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={images[currentImageIndex]} 
              alt="Area full view" 
              className="object-contain max-h-[90vh] max-w-full"
            />
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                >
                  &lt;
                </button>
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                >
                  &gt;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
