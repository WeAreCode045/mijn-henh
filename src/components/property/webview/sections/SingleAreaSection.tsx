
import { PropertyData } from "@/types/property";
import { WebViewSectionProps } from "../types";
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
  
  // Get area photos
  // 1. First check if area has its own images property
  let areaPhotos: string[] = [];
  if (area.images && area.images.length > 0) {
    areaPhotos = area.images.map(img => typeof img === 'object' && img.url ? img.url : String(img));
  } 
  // 2. If no area images found, try to filter from property images
  else if (Array.isArray(property.images)) {
    areaPhotos = property.images
      .filter(img => {
        if (typeof img === 'object' && 'area' in img && img.area === area.id) {
          return true;
        }
        return false;
      })
      .map(img => typeof img === 'object' && 'url' in img ? img.url : String(img));
  }
  
  console.log(`Area ${areaIndex} photos:`, areaPhotos);
  
  return (
    <div className="space-y-6 px-6">
      <h2 
        className="text-2xl font-bold"
        style={{ color: settings?.secondaryColor }}
      >
        {areaTitle}
      </h2>
      
      {/* Area description */}
      {area.description && (
        <div className="prose prose-slate max-w-none">
          <p>{area.description}</p>
        </div>
      )}
      
      {/* Area images */}
      {areaPhotos.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {areaPhotos.map((photoUrl, idx) => (
              <div key={idx} className="aspect-video rounded-md overflow-hidden">
                <img 
                  src={photoUrl} 
                  alt={`${areaTitle} - Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
