
import { useEffect } from 'react';
import { PropertyData } from '@/types/property';

export function useWebViewDebug(propertyData: PropertyData | null, isLoading: boolean, error: string | null) {
  useEffect(() => {
    console.group('WebView Debug Information');
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
    
    if (propertyData) {
      console.log('Property ID:', propertyData.id);
      console.log('Object ID:', propertyData.object_id);
      console.log('Title:', propertyData.title);
      console.log('Images count:', propertyData.images?.length || 0);
      console.log('Has featured image:', !!propertyData.featuredImage);
      console.log('Areas count:', propertyData.areas?.length || 0);
      console.log('Features count:', propertyData.features?.length || 0);
      console.log('Has floorplan script:', !!propertyData.floorplanEmbedScript);
      console.log('Has agent info:', !!propertyData.agent);
    } else {
      console.log('Property data is null');
    }
    
    console.groupEnd();
  }, [propertyData, isLoading, error]);
  
  return {
    logInfo: (message: string, data?: any) => {
      console.log(`WebView Debug - ${message}:`, data);
    }
  };
}
