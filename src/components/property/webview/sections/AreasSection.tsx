
import { WebViewSectionProps } from "../types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyImage } from "@/types/property";

// Update the interface to include boolean properties
interface PropertyImageWithArea extends PropertyImage {
  area?: string | null;
  is_featured?: boolean;
  is_grid_image?: boolean;
}

export function AreasSection({ property, settings }: WebViewSectionProps) {
  const [areaImages, setAreaImages] = useState<Record<string, PropertyImageWithArea[]>>({});
  
  useEffect(() => {
    const fetchAreaImages = async () => {
      if (!property.id || !property.areas || property.areas.length === 0) return;
      
      try {
        // Fetch images from property_images table
        const { data, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', property.id)
          .not('area', 'is', null);
          
        if (error) {
          console.error('Error fetching area images:', error);
          return;
        }
        
        // Group images by area
        const imagesByArea: Record<string, PropertyImageWithArea[]> = {};
        
        if (data && data.length > 0) {
          data.forEach(img => {
            // Cast to PropertyImageWithArea since we know it matches our updated interface
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

  // Calculate which areas should be shown on this page based on the page number
  const pageMatch = property.currentPath?.match(/areas-(\d+)/);
  const pageIndex = pageMatch ? parseInt(pageMatch[1]) : 0;
  const startIndex = pageIndex * 2;
  const areasForThisPage = property.areas.slice(startIndex, startIndex + 2);
  
  // Get image URLs for an area
  const getAreaImages = (areaId: string): string[] => {
    // First check if we have images from the property_images table
    if (areaImages[areaId]) {
      return areaImages[areaId].map(img => img.url);
    }
    
    // Fallback to using imageIds from the area in the property.images array
    const area = property.areas?.find(a => a.id === areaId);
    if (!area || !area.imageIds || !property.images) return [];
    
    // Find matching images based on ID
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
          const columnCount = area.columns || 2; // Default to 2 columns if not specified
          
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
