
import { useEffect } from "react";
import { AgencySettings } from "@/types/agency";

export function useWebViewBackground(settings: AgencySettings) {
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
      document.documentElement.style.setProperty(
        '--webview-bg-size',
        '60%'  // Set background size to 60%
      );
      document.documentElement.style.setProperty(
        '--webview-bg-opacity',
        '0.5'  // Set background opacity to 50%
      );
    } else {
      document.documentElement.style.removeProperty('--webview-bg-image');
      document.documentElement.style.removeProperty('--webview-bg-position');
      document.documentElement.style.removeProperty('--webview-bg-size');
      document.documentElement.style.removeProperty('--webview-bg-opacity');
    }
    
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
      document.documentElement.style.removeProperty('--webview-bg-image');
      document.documentElement.style.removeProperty('--webview-bg-position');
      document.documentElement.style.removeProperty('--webview-bg-size');
      document.documentElement.style.removeProperty('--webview-bg-opacity');
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--secondary-color');
    };
  }, [settings?.webviewBackgroundUrl, settings?.primaryColor, settings?.secondaryColor]);
}
