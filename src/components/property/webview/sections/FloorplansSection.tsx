
import { WebViewSectionProps } from "../types";
import { useState } from "react";
import { ImagePreviewDialog } from "../components/ImagePreviewDialog";

export function FloorplansSection({ property }: WebViewSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadErrors, setLoadErrors] = useState<Record<string, boolean>>({});

  // Parse floorplans from property data
  const parseFloorplans = (): any[] => {
    if (!property.floorplans || !Array.isArray(property.floorplans) || property.floorplans.length === 0) {
      return [];
    }
    
    return property.floorplans.map(plan => {
      if (typeof plan === 'string') {
        try {
          // If it's a stringified JSON object, try to parse it
          return JSON.parse(plan);
        } catch (e) {
          // If parsing fails, assume it's a direct URL string
          return { id: crypto.randomUUID(), url: plan, title: 'Floorplan' };
        }
      } else if (plan && typeof plan === 'object') {
        // If it's already an object
        return {
          id: plan.id || crypto.randomUUID(),
          url: plan.url || '',
          title: plan.title || 'Floorplan'
        };
      }
      
      // Fallback for invalid data
      return { id: crypto.randomUUID(), url: '', title: 'Floorplan' };
    }).filter(plan => plan.url); // Filter out items without URLs
  };

  const floorplans = parseFloorplans();

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const handleImageError = (url: string) => {
    setLoadErrors(prev => ({ ...prev, [url]: true }));
  };

  // Don't render anything if there are no valid floorplans and no embed script
  if ((!floorplans.length || floorplans.every(plan => loadErrors[plan.url])) && !property.floorplanEmbedScript) {
    return null;
  }

  return (
    <div className="space-y-6 pb-24 relative">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6 relative">
        <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
        
        {property.floorplanEmbedScript && (
          <div className="mb-6 w-full">
            <div 
              className="w-full h-[400px] rounded-lg overflow-hidden" 
              dangerouslySetInnerHTML={{ __html: property.floorplanEmbedScript }}
            />
          </div>
        )}
        
        {floorplans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {floorplans.map((floorplan, index) => (
              <div 
                key={floorplan.id || `floorplan-${index}`} 
                className="w-full cursor-pointer shadow-md rounded-lg overflow-hidden"
                onClick={() => handleImageClick(floorplan.url)}
              >
                <img
                  src={floorplan.url}
                  alt={floorplan.title || `Floorplan ${index + 1}`}
                  className="w-full h-auto object-contain max-h-[400px]"
                  onError={() => handleImageError(floorplan.url)}
                />
                {floorplan.title && (
                  <div className="p-2 bg-white/90 text-center font-medium">
                    {floorplan.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!floorplans.length && !property.floorplanEmbedScript && (
          <div className="text-center py-6 bg-gray-50 rounded-md text-gray-500">
            No floorplans available
          </div>
        )}
      </div>

      {/* Image preview dialog */}
      <ImagePreviewDialog selectedImage={selectedImage} onClose={handleClosePreview} />
    </div>
  );
}
