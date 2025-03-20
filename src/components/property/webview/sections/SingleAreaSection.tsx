
import { PropertyData } from "@/types/property";
import { WebViewSectionProps } from "../types";
import { useState } from "react";
import "../styles/WebViewStyles.css";
import { AreaImageSlider } from "../AreaImageSlider";

export function SingleAreaSection({ property, settings, areaIndex = 0 }: WebViewSectionProps & { areaIndex?: number }) {
  // Ensure areas exist and the requested index is valid
  if (!property.areas || !property.areas[areaIndex]) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No area information available</p>
      </div>
    );
  }
  
  const area = property.areas[areaIndex];
  const areaTitle = area.title || `Area ${areaIndex + 1}`;
  
  // Get area photos by finding property images that have this area's id
  const areaPhotos = property.images
    .filter(img => img.area === area.id)
    .map(img => img.url);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">{areaTitle}</h2>
      
      {/* Area description */}
      {area.description && (
        <div className="prose prose-slate max-w-none">
          <p>{area.description}</p>
        </div>
      )}
      
      {/* Area images slider */}
      {areaPhotos.length > 0 && (
        <div className="mt-6">
          <AreaImageSlider areaImages={areaPhotos} areaTitle={areaTitle} />
        </div>
      )}
    </div>
  );
}
