
import { WebViewSectionProps } from "../types";

export function AreasSection({ property, settings }: WebViewSectionProps) {
  if (!property.areas || property.areas.length === 0) return null;

  // Calculate which areas should be shown on this page based on the page number
  const pageMatch = property.currentPath?.match(/areas-(\d+)/);
  const pageIndex = pageMatch ? parseInt(pageMatch[1]) : 0;
  const startIndex = pageIndex * 2;
  const areasForThisPage = property.areas.slice(startIndex, startIndex + 2);

  // Get image URLs for an area based on its imageIds
  const getAreaImages = (imageIds: string[]): string[] => {
    if (!imageIds || !property.images) return [];
    
    // Find matching images based on ID
    return property.images
      .filter(img => imageIds.includes(img.id))
      .map(img => img.url);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="px-6 space-y-8">
        {areasForThisPage.map((area, index) => {
          const areaImages = getAreaImages(area.imageIds || []);
          const columnCount = area.columns || 2; // Default to 2 columns if not specified
          
          return (
            <div key={index} className="space-y-4 bg-white/90 p-4 rounded-lg shadow-sm">
              <div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: settings?.secondaryColor }}
                >
                  {area.title}
                </h3>
                <p className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {area.description}
                </p>
              </div>

              {areaImages.length > 0 && (
                <div 
                  className={`grid gap-4`}
                  style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                >
                  {areaImages.map((imageUrl, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={imageUrl}
                      alt={`${area.title} ${imgIndex + 1}`}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
