
import { PropertyData } from "@/types/property";
import { WebViewSectionProps } from "../types";
import "../styles/WebViewStyles.css";

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
  
  // Improved area images extraction logic
  let areaPhotos: string[] = [];
  
  // 1. First check if area has its own images property
  if (area.images && Array.isArray(area.images) && area.images.length > 0) {
    areaPhotos = area.images.map(img => 
      typeof img === 'string' ? img : 
      typeof img === 'object' && img && 'url' in img ? img.url : ''
    ).filter(url => url !== '');
    console.log(`Found ${areaPhotos.length} direct images for area ${area.id}`);
  }
  
  // 2. If no area images found yet, check for areaImages property (new format)
  if (areaPhotos.length === 0 && area.areaImages && Array.isArray(area.areaImages) && area.areaImages.length > 0) {
    areaPhotos = area.areaImages.map(img => img.url).filter(Boolean);
    console.log(`Found ${areaPhotos.length} areaImages for area ${area.id}`);
  }
  
  // 3. If still no images found, try to filter from property images 
  if (areaPhotos.length === 0 && Array.isArray(property.images)) {
    areaPhotos = property.images
      .filter(img => {
        if (typeof img === 'object' && img && 'area' in img && img.area === area.id) {
          return true;
        }
        return false;
      })
      .map(img => typeof img === 'object' && 'url' in img ? img.url : String(img))
      .filter(url => url !== '');
    
    console.log(`Found ${areaPhotos.length} property images with area=${area.id}`);
  }
  
  console.log(`Area ${areaIndex} (${area.title}) final photos:`, areaPhotos);
  
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
          <p className="whitespace-pre-wrap">{area.description}</p>
        </div>
      )}
      
      {/* Area images - always try to display if we have any */}
      {areaPhotos.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {areaPhotos.map((photoUrl, idx) => (
              <div key={idx} className="aspect-video rounded-md overflow-hidden shadow-md">
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
