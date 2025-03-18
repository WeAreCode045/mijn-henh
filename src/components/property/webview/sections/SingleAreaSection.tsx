
import React from "react";
import { PropertyImage, PropertyArea } from "@/types/property";

export interface SingleAreaSectionProps {
  area: PropertyArea;
  areaImages: PropertyImage[];
  property?: any;
  settings?: any;
  areaIndex?: number;
}

export function SingleAreaSection({ area, areaImages }: SingleAreaSectionProps) {
  // Convert all images to PropertyImage type
  const processedImages = areaImages.map(img => 
    typeof img === 'string' 
      ? { id: `img-${Math.random()}`, url: img, type: 'image' as const } 
      : img
  );

  return (
    <div className="section area-section">
      <div className="section-header">
        <h2 className="section-title">{area.title || area.name}</h2>
        {area.description && (
          <p className="section-description">{area.description}</p>
        )}
      </div>
      
      {processedImages.length > 0 && (
        <div className="area-images">
          {processedImages.map((img) => (
            <div key={img.id} className="area-image-item">
              <img 
                src={img.url} 
                alt={`${area.title || area.name} - ${img.id}`} 
                className="area-image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
