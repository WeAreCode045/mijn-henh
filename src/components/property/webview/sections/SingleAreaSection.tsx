
import { WebViewSectionProps } from "../types";
import { PropertyArea } from "@/types/property";
import "../styles/WebViewStyles.css";

interface SingleAreaSectionProps extends WebViewSectionProps {
  areaIndex: number;
}

export function SingleAreaSection({ property, areaIndex }: SingleAreaSectionProps) {
  if (!property.areas || !property.areas[areaIndex]) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Area not found</p>
      </div>
    );
  }

  const area = property.areas[areaIndex] as PropertyArea;
  
  // Find images for this area
  const areaImages: string[] = [];
  if (area.imageIds && Array.isArray(area.imageIds)) {
    // Get all property images
    const allImages = Array.isArray(property.images) ? property.images : [];
    
    // Filter images for this area
    area.imageIds.forEach(imageId => {
      const foundImage = allImages.find(img => 
        (typeof img === 'string' && img === imageId) || 
        (typeof img === 'object' && img.id === imageId)
      );
      
      if (foundImage) {
        if (typeof foundImage === 'string') {
          areaImages.push(foundImage);
        } else if (foundImage.url) {
          areaImages.push(foundImage.url);
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-estate-800">{area.title}</h2>
      
      {/* Area details */}
      <div className="bg-white rounded-lg shadow p-6">
        {area.description && (
          <div className="mb-6">
            <p className="text-estate-700">{area.description}</p>
          </div>
        )}
        
        {/* Area specifications */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {area.sqFt && (
            <div className="flex flex-col">
              <span className="text-sm text-estate-500">Size</span>
              <span className="font-medium">{area.sqFt} sq ft</span>
            </div>
          )}
          {area.dimensions && (
            <div className="flex flex-col">
              <span className="text-sm text-estate-500">Dimensions</span>
              <span className="font-medium">{area.dimensions}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Area images */}
      {areaImages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {areaImages.map((imageUrl, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md">
              <img 
                src={imageUrl} 
                alt={`${area.title} - Image ${index + 1}`} 
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
