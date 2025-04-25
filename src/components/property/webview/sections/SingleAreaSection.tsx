
import { WebViewSectionProps } from "../types";
import { AreaImageSlider } from "../AreaImageSlider";
import { PropertyImage } from "@/types/property";

interface SingleAreaSectionProps extends WebViewSectionProps {
  areaIndex: number;
}

export function SingleAreaSection({ property, settings, areaIndex }: SingleAreaSectionProps) {
  // Safety check
  if (!property.areas || !property.areas[areaIndex]) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">Area not found</p>
      </div>
    );
  }

  const area = property.areas[areaIndex];
  
  // Extract image URLs from PropertyImage objects
  const areaImageUrls: string[] = [];
  
  if (area.images && Array.isArray(area.images)) {
    area.images.forEach((img) => {
      if (typeof img === 'string') {
        areaImageUrls.push(img);
      } else if (typeof img === 'object' && img && 'url' in img) {
        areaImageUrls.push(img.url);
      }
    });
  }

  console.log(`Area ${areaIndex} image URLs:`, areaImageUrls);

  return (
    <div className="space-y-6 pb-8">
      <div className="px-6">
        <div className="bg-white/90 p-4 rounded-lg shadow-sm">
          {/* Area Title */}
          <h2 
            className="text-xl font-semibold mb-3"
            style={{ color: settings?.secondaryColor }}
          >
            {area.title || area.name || `Area ${areaIndex + 1}`}
          </h2>
          
          {/* Area Images */}
          {areaImageUrls.length > 0 ? (
            <div className="mb-4">
              <AreaImageSlider 
                images={areaImageUrls} 
                areaTitle={area.title || area.name} 
              />
            </div>
          ) : (
            <div className="mb-4 bg-gray-100 h-48 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No images available for this area</p>
            </div>
          )}
          
          {/* Area Description */}
          <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap mt-3">
            {area.description || "No description available."}
          </p>
          
          {/* Area Metadata */}
          {area.size && (
            <div className="mt-2 flex items-center">
              <span className="text-sm font-medium">Size:</span>
              <span className="ml-2 text-sm text-gray-600">{area.size} m²</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
