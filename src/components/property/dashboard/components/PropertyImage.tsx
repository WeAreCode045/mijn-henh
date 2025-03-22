
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyImageProps {
  property: {
    id: string;
    title: string;
  };
}

export function PropertyImage({ property }: PropertyImageProps) {
  const [mainImage, setMainImage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPropertyImages = async () => {
      if (!property.id) return;
      
      // Fetch property images from property_images table
      const { data: imageData, error: imageError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', property.id)
        .order('sort_order', { ascending: true });
        
      if (imageError) {
        console.error("Error fetching property images:", imageError);
        return;
      }
      
      // Find the main image (is_main = true) or use the first image
      if (imageData && imageData.length > 0) {
        const mainImageData = imageData.find(img => img.is_main);
        if (mainImageData) {
          setMainImage(mainImageData.url);
        } else {
          // If no main image is set, use the first image
          setMainImage(imageData[0].url);
        }
      }
    };
    
    fetchPropertyImages();
  }, [property.id]);
  
  return (
    <div className="h-40 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
      {mainImage ? (
        <img 
          src={mainImage} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No image
        </div>
      )}
    </div>
  );
}
