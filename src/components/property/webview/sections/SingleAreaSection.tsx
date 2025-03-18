
import React from "react";
import { PropertyArea, PropertyImage } from "@/types/property";
import { getImageUrl } from "@/utils/imageUrlHelpers";

interface SingleAreaSectionProps {
  area: PropertyArea;
  className?: string;
}

export function SingleAreaSection({ area, className = "" }: SingleAreaSectionProps) {
  // Filter images that belong to this area
  const areaImages = React.useMemo(() => {
    return Array.isArray(area.images) ? area.images : [];
  }, [area.images]);

  if (!area || areaImages.length === 0) {
    return null;
  }

  return (
    <section className={`area-section ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{area.title || area.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areaImages.map((image, index) => {
          const imageUrl = getImageUrl(image);
          
          return (
            <div key={index} className="area-image rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={`${area.name} - Image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          );
        })}
      </div>
      
      {area.description && (
        <div className="mt-4 prose max-w-none">
          <p>{area.description}</p>
        </div>
      )}
    </section>
  );
}
