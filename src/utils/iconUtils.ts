
import { supabase } from "@/integrations/supabase/client";

// Cache for SVG icons and their URLs to avoid repeated fetches
const svgCache: Record<string, string> = {};
const urlCache: Record<string, string> = {};

/**
 * Fetch SVG content from Supabase storage
 */
export const fetchSvgIcon = async (iconName: string, theme: 'light' | 'dark' = 'dark'): Promise<string | null> => {
  // Check cache first
  const cacheKey = `${theme}-${iconName}`;
  if (svgCache[cacheKey]) {
    return svgCache[cacheKey];
  }
  
  try {
    const { data, error } = await supabase.storage
      .from('global')
      .download(`icons/${theme}/${iconName}.svg`);
      
    if (error || !data) {
      console.error(`Error fetching icon ${iconName}:`, error);
      return null;
    }
    
    const svgText = await data.text();
    // Cache the result
    svgCache[cacheKey] = svgText;
    return svgText;
  } catch (error) {
    console.error(`Error processing icon ${iconName}:`, error);
    return null;
  }
};

/**
 * Get public URL for an SVG icon from Supabase storage
 */
export const getSvgIconUrl = async (iconName: string, theme: 'light' | 'dark' = 'dark'): Promise<string | null> => {
  // Check cache first
  const cacheKey = `url-${theme}-${iconName}`;
  if (urlCache[cacheKey]) {
    return urlCache[cacheKey];
  }
  
  try {
    const { data } = await supabase.storage
      .from('global')
      .getPublicUrl(`icons/${theme}/${iconName}.svg`);
      
    if (data?.publicUrl) {
      // Cache the result
      urlCache[cacheKey] = data.publicUrl;
      return data.publicUrl;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting URL for icon ${iconName}:`, error);
    return null;
  }
};

/**
 * List of available icons
 * These should match the icons stored in Supabase
 */
export const availableIcons = [
  'home',
  'calendar',
  'bed',
  'bath',
  'zap',
  'ruler',
  'car',
  'map-pin',
  'landmark',
  'building',
  'house',
  'warehouse',
  'city',
  'tree',
  'pool',
  'key',
  'door',
  'sun',
  'leaf',
];
