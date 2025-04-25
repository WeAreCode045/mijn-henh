
import { WebViewSectionProps } from "../types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyImage } from "@/types/property";
import { AreaImageSlider } from "../AreaImageSlider";

interface PropertyImageWithArea extends PropertyImage {
  area?: string | null;
  [key: string]: string | boolean | number | null | undefined;
}

interface AreasSectionProps extends WebViewSectionProps {
  currentAreaId?: string;
}

export function AreasSection({ property, settings, currentAreaId }: AreasSectionProps) {
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
        console.log("Area images fetched:", imagesByArea);
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

  // If a specific area ID is provided, show only that area
  const areasToDisplay = currentAreaId
    ? property.areas.filter(area => area.id === currentAreaId)
    : property.areas;
  
  const getAreaImages = (area: any): string[] => {
    // First try to get images from our fetched area images
    if (areaImages[area.id] && areaImages[area.id].length > 0) {
      return areaImages[area.id].map(img => img.url);
    }
    
    // Then try to get them from area.images if available
    if (area.images && Array.isArray(area.images) && area.images.length > 0) {
      return area.images.map((img: any) => typeof img === 'string' ? img : img.url);
    }
    
    // Then try to get them from area.areaImages if available
    if (area.areaImages && Array.isArray(area.areaImages) && area.areaImages.length > 0) {
      return area.areaImages.map((img: any) => img.url);
    }
    
    return [];
  };

  return (
    <div className="space-y-4 pb-24 overflow-y-hidden">
      <div className="px-6 space-y-8">
        {areasToDisplay.map((area, index) => {
          const areaImagesUrls = getAreaImages(area);
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

              {/* Use AreaImageSlider to display images */}
              <div className="mt-4">
                {areaImagesUrls.length > 0 ? (
                  <AreaImageSlider 
                    images={areaImagesUrls} 
                    areaTitle={area.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No images available for this area</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
