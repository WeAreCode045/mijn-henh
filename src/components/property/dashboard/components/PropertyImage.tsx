
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
      
      // Fetch the property's featured image or first image
      const { data, error } = await supabase
        .from('properties')
        .select('featured_image, images')
        .eq('id', property.id)
        .single();
        
      if (error) {
        console.error("Error fetching property images:", error);
        return;
      }
      
      if (data) {
        if (data.featured_image) {
          setMainImage(data.featured_image);
        } else if (data.images && data.images.length > 0) {
          // If no featured image, use the first image from the images array
          const firstImage = data.images[0]?.url || null;
          setMainImage(firstImage);
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
