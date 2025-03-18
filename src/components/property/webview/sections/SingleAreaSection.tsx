import { PropertyData } from "@/types/property";
import { WebViewSectionProps } from "../types";
import { useState } from "react";
import "../styles/WebViewStyles.css";

export function SingleAreaSection({ property, settings, areaIndex = 0 }: WebViewSectionProps & { areaIndex?: number }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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
    .map(img => getImageUrl(img));
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">{areaTitle}</h2>
      
      {/* Area description */}
      {area.description && (
        <div className="prose prose-slate max-w-none">
          <p>{area.description}</p>
        </div>
      )}
      
      {/* Area images gallery */}
      {areaPhotos.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areaPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(photo)}
              >
                <img 
                  src={photo} 
                  alt={`${areaTitle} photo ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Area details - Only show if there's custom data for this area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* We don't have sqft in the PropertyArea type, so we won't display it directly */}
        {property.sqft && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Area:</span>
            <span>{property.sqft} sq ft</span>
          </div>
        )}
        
        {/* Similarly, dimensions isn't in the PropertyArea type */}
        {property.livingArea && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Living Area:</span>
            <span>{property.livingArea}</span>
          </div>
        )}
      </div>
      
      {/* Modal for full-size image view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Area full view" 
              className="object-contain max-h-[90vh] max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
