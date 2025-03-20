
import { WebViewSectionProps } from "../types";
import "../styles/WebViewStyles.css";
import { useState } from "react";

export function FloorplanSection({ property }: WebViewSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Enhanced logging to debug floorplan issues
  console.log('FloorplanSection rendered:', {
    propertyId: property.id,
    hasFloorplanScript: !!property.floorplanEmbedScript,
    scriptLength: property.floorplanEmbedScript ? property.floorplanEmbedScript.length : 0,
    scriptPreview: property.floorplanEmbedScript ? property.floorplanEmbedScript.substring(0, 50) + '...' : 'none',
    floorplanImages: property.floorplans?.length || 0
  });
  
  // Get floorplan images if available
  const floorplanImages = property.floorplans?.map(f => f.url) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">Floorplan</h2>
      
      {/* Embedded floorplan viewer */}
      {property.floorplanEmbedScript && property.floorplanEmbedScript.trim() !== '' && (
        <div className="w-full overflow-hidden rounded-lg shadow-md mb-6">
          <div 
            className="w-full min-h-[500px]"
            dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }} 
          />
        </div>
      )}
      
      {/* Floorplan images grid */}
      {floorplanImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Floorplan Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {floorplanImages.map((image, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Floorplan ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* No floorplan content message */}
      {(!property.floorplanEmbedScript || property.floorplanEmbedScript.trim() === '') && floorplanImages.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No floorplan available for this property</p>
        </div>
      )}
      
      {/* Lightbox for full-size view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Floorplan full view" 
              className="object-contain max-h-[90vh] max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
