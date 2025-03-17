
import { useEffect } from 'react';

export const useWebViewBackground = (settings: any) => {
  useEffect(() => {
    // Set background from settings if available
    if (settings?.backgroundImage) {
      document.documentElement.style.setProperty('--webview-background', `url(${settings.backgroundImage})`);
    } else {
      // Default background
      document.documentElement.style.setProperty('--webview-background', 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)');
    }
    
    // Cleanup function
    return () => {
      document.documentElement.style.removeProperty('--webview-background');
    };
  }, [settings?.backgroundImage]);
};
