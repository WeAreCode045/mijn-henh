
import React from 'react';
import { PropertyArea, PropertyImage } from "@/types/property";
import { ImageGallery } from '@/components/property/webview/gallery/ImageGallery';
import { AreaFeatures } from '../areas/AreaFeatures';

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
          <ImageGallery 
            images={areaImages} 
            columns={area.columns || 2} 
          />
        </div>
      )}
      
      <AreaFeatures area={area} />
    </div>
  );
}
