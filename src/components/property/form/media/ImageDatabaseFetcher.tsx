
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyImage } from "@/types/property";

interface ImageDatabaseFetcherProps {
  propertyId: string;
  onImagesUpdate: (images: PropertyImage[]) => void;
}

export function ImageDatabaseFetcher({
  propertyId,
  onImagesUpdate
}: ImageDatabaseFetcherProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', propertyId)
          .eq('type', 'image')
          .order('sort_order', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedImages = data.map((img): PropertyImage => ({
            id: img.id,
            url: img.url,
            type: 'image',
            is_main: img.is_main || false,
            is_featured_image: img.is_featured_image || false,
            sort_order: img.sort_order || 0,
            property_id: img.property_id,
            area: img.area || null,
            alt: '', // Default empty string for alt
            title: '', // Default empty string for title
            description: '' // Default empty string for description
          }));
          onImagesUpdate(formattedImages);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [propertyId, onImagesUpdate]);

  // Component doesn't render anything
  return null;
}
