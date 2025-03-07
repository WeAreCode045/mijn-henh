
import { useEffect } from "react";
import { AgencySettings } from "@/types/agency";

export function useWebViewBackground(settings: AgencySettings) {
  useEffect(() => {
    if (settings.webviewBackgroundUrl) {
      document.documentElement.style.setProperty(
        '--webview-bg-image', 
        `url(${settings.webviewBackgroundUrl})`
      );
    } else {
      document.documentElement.style.removeProperty('--webview-bg-image');
    }
    
    // Cleanup function to remove the property when component unmounts
    return () => {
      document.documentElement.style.removeProperty('--webview-bg-image');
    };
  }, [settings.webviewBackgroundUrl]);
}
