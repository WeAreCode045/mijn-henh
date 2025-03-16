
import { useEffect } from "react";
import { AgencySettings } from "@/types/agency";
import { useThemeColors } from "@/hooks/useThemeColors";

export function useWebViewBackground(settings: AgencySettings) {
  // Use the generic theme colors hook for color properties
  useThemeColors(settings);
  
  useEffect(() => {
    // Set background image if available
    if (settings?.webviewBackgroundUrl) {
      document.documentElement.style.setProperty(
        '--webview-bg-image', 
        `url(${settings.webviewBackgroundUrl})`
      );
      document.documentElement.style.setProperty(
        '--webview-bg-position',
        'bottom right'
      );
    } else {
      document.documentElement.style.removeProperty('--webview-bg-image');
      document.documentElement.style.removeProperty('--webview-bg-position');
    }
    
    // Cleanup function to remove the properties when component unmounts
    return () => {
      document.documentElement.style.removeProperty('--webview-bg-image');
      document.documentElement.style.removeProperty('--webview-bg-position');
    };
  }, [settings?.webviewBackgroundUrl]);
}
