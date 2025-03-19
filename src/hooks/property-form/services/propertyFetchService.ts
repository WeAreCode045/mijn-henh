
import { supabase } from "@/integrations/supabase/client";
import { PropertyImage } from "@/types/property";

/**
 * Service to fetch property data from Supabase
 */
export const fetchPropertyData = async (id: string) => {
  if (!id) {
    throw new Error("Property ID is required");
  }
  
  console.log("Fetching property data for ID:", id);
  
  // Fetch the property with related images and agent data in a single request
  const { data: propertyData, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images(*),
      agent:profiles(id, full_name, email, phone, avatar_url, whatsapp_number)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    throw error;
  }
  
  if (!propertyData) {
    throw new Error(`No property found with ID: ${id}`);
  }
  
  // Extract and process images from the joined data
  const imageData = propertyData.property_images || [];
  
  // Process images with proper type conversion
  const processedImages = imageData.map((img: any) => ({
    id: img.id,
    url: img.url,
    area: img.area,
    property_id: img.property_id,
    is_main: img.is_main,
    is_featured_image: img.is_featured_image,
    sort_order: img.sort_order,
    type: (img.type || "image") as "image" | "floorplan",
    title: img.title || '',
    description: img.description || '',
    alt: img.alt || ''
  })) as PropertyImage[];
  
  return { propertyData, processedImages };
};
