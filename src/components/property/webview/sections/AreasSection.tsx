
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
        
        setAreaImages(imagesByArea);
      } catch (err) {
        console.error('Error fetching area images:', err);
      }
    };
    
    fetchAreaImages();
  }, [property.id, property.areas]);

  if (!property.areas || property.areas.length === 0) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">No areas available for this property</p>
      </div>
    );
  }

  // Ensure we have valid areas to display
  const areasToDisplay = property.areas.slice(0, 2);
  
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

  return (
    <div className="space-y-4 pb-24">
      <div className="px-6 space-y-8">
        {areasToDisplay.map((area, index) => {
          const areaImagesUrls = getAreaImages(area.id);
          const columnCount = area.columns || 2;
          
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
