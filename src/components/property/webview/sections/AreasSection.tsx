import { WebViewSectionProps } from "../types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyImage } from "@/types/property";

interface PropertyImageWithArea extends PropertyImage {
  area?: string | null;
  [key: string]: string | boolean | number | null | undefined;
}

export function AreasSection({ property, settings }: WebViewSectionProps) {
  const [areaImages, setAreaImages] = useState<Record<string, PropertyImageWithArea[]>>({});
  
  useEffect(() => {
    const fetchAreaImages = async () => {
      if (!property.id || !property.areas || property.areas.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', property.id)
          .not('area', 'is', null);
          
        if (error) {
          console.error('Error fetching area images:', error);
          return;
        }
        
        const imagesByArea: Record<string, PropertyImageWithArea[]> = {};
        
        if (data && data.length > 0) {
          data.forEach(img => {
            const image = img as PropertyImageWithArea;
            if (image.area) {
              if (!imagesByArea[image.area]) {
                imagesByArea[image.area] = [];
              }
              imagesByArea[image.area].push(image);
            }
          });
        }
        
        console.log('Area images from property_images table:', imagesByArea);
        setAreaImages(imagesByArea);
      } catch (err) {
        console.error('Error fetching area images:', err);
      }
    };
    
    fetchAreaImages();
  }, [property.id, property.areas]);

  if (!property.areas || property.areas.length === 0) return null;

  const pageMatch = property.currentPath?.match(/areas-(\d+)/);
  const pageIndex = pageMatch ? parseInt(pageMatch[1]) : 0;
  const startIndex = pageIndex * 2;
  const areasForThisPage = property.areas.slice(startIndex, startIndex + 2);
  
  const getAreaImages = (areaId: string): string[] => {
    if (areaImages[areaId]) {
      return areaImages[areaId].map(img => img.url);
    }
    
    const area = property.areas?.find(a => a.id === areaId);
    if (!area || !area.imageIds || !property.images) return [];
    
    return property.images
      .filter(img => area.imageIds.includes(img.id))
      .map(img => img.url);
  };

  console.log("AreasSection - property.areas:", property.areas);

  return (
    <div className="space-y-4 pb-24">
      <div className="px-6 space-y-8">
        {areasForThisPage.map((area, index) => {
          const areaImagesUrls = getAreaImages(area.id);
          const columnCount = area.columns || 2;
          
          console.log(`Area ${index} (${area.title}) - columns:`, columnCount);
          console.log(`Area ${index} (${area.title}) - resolved images:`, areaImagesUrls);
          
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

              {areaImagesUrls.length > 0 && (
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                >
                  {areaImagesUrls.map((imageUrl, imgIndex) => (
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
