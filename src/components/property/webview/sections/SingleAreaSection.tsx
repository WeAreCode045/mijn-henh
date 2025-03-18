
import React from 'react';
import { PropertyArea, PropertyImage } from "@/types/property";

export interface SingleAreaSectionProps {
  area: PropertyArea;
  areaImages: PropertyImage[];
}

export function SingleAreaSection({ area, areaImages }: SingleAreaSectionProps) {
  if (!area) return null;
  
  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold mb-4">{area.name || 'Area'}</h3>
      
      {area.description && (
        <div className="mb-6 text-gray-700">
          <p>{area.description}</p>
        </div>
      )}
      
      {area.size && (
        <div className="mb-6">
          <p className="text-lg">
            <span className="font-medium">Size:</span> {area.size} {area.unit || 'm²'}
          </p>
        </div>
      )}
      
      {areaImages && areaImages.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areaImages.map((image) => (
              <div key={image.id} className="relative rounded overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt || area.name} 
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {/* Area features would go here */}
      </div>
    </div>
  );
}
