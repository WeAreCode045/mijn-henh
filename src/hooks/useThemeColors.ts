
import { useEffect } from "react";
import { AgencySettings } from "@/types/agency";

interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
}

/**
 * A hook that sets CSS custom properties for theme colors
 * and returns the colors for direct use in components
 */
export function useThemeColors(settings?: AgencySettings): ThemeColors {
  useEffect(() => {
    // Set agency colors as CSS custom properties
    if (settings?.primaryColor) {
      document.documentElement.style.setProperty(
        '--primary-color', 
        settings.primaryColor
      );
    }
    
    if (settings?.secondaryColor) {
      document.documentElement.style.setProperty(
        '--secondary-color', 
        settings.secondaryColor
      );
    }
    
    // Cleanup function to remove the properties when component unmounts
    return () => {
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--secondary-color');
    };
  }, [settings?.primaryColor, settings?.secondaryColor]);

  return {
    primaryColor: settings?.primaryColor || '#40497A',
    secondaryColor: settings?.secondaryColor || '#E2E8F0'
  };
}
