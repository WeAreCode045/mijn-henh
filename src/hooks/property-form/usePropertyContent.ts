
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData, PropertyFeature, PropertyArea, PropertyPlaceType, PropertyCity, GeneralInfoData } from '@/types/property';
import { 
  transformFeatures, 
  transformAreas, 
  transformNearbyPlaces, 
  transformGeneralInfo 
} from './propertyDataTransformer';

const safelyParse = <T,>(data: any, transformer: (data: any[]) => T[]): T[] => {
  if (Array.isArray(data)) {
    return transformer(data);
  }
  
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return transformer(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error("Error parsing data:", e);
      return [] as T[];
    }
  }
  
  return [] as T[];
};

export function usePropertyContent(propertyId: string) {
  const [formData, setFormData] = useState<PropertyFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const { toast } = useToast();

  const fetchPropertyData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Make sure propertyId is a string, not an object
      const id = typeof propertyId === 'string' ? propertyId : '';
      
      if (!id) {
        console.error('Invalid property ID:', propertyId);
        throw new Error('Invalid property ID');
      }

      console.log("Fetching property with ID:", id);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const features = safelyParse<PropertyFeature>(data.features, transformFeatures);
        const areas = safelyParse<PropertyArea>(data.areas, transformAreas);
        const nearbyPlaces = safelyParse<PropertyPlaceType>(data.nearby_places, transformNearbyPlaces);
        
        let nearbyCities: PropertyCity[] = [];
        try {
          if (data.nearby_cities) {
            if (Array.isArray(data.nearby_cities)) {
              nearbyCities = data.nearby_cities;
            } else if (typeof data.nearby_cities === 'string') {
              const parsed = JSON.parse(data.nearby_cities);
              nearbyCities = Array.isArray(parsed) ? parsed : [];
            }
          }
        } catch (e) {
          console.error("Error parsing nearby_cities:", e);
        }
        
        const generalInfo = transformGeneralInfo(data.generalInfo);
        
        setFormData({
          id: data.id,
          title: data.title || '',
          price: data.price || '',
          address: data.address || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          sqft: data.sqft || '',
          livingArea: data.livingArea || '',
          buildYear: data.buildYear || '',
          garages: data.garages || '',
          energyLabel: data.energyLabel || '',
          hasGarden: !!data.hasGarden,
          description: data.description || '',
          shortDescription: data.shortDescription || '',
          location_description: data.location_description || '',
          features,
          areas,
          nearby_places: nearbyPlaces,
          nearby_cities: nearbyCities,
          latitude: data.latitude !== undefined ? data.latitude : null,
          longitude: data.longitude !== undefined ? data.longitude : null,
          object_id: data.object_id || '',
          agent_id: data.agent_id || '',
          template_id: data.template_id || '',
          floorplanEmbedScript: data.floorplanEmbedScript || '',
          virtualTourUrl: data.virtualTourUrl || '',
          youtubeUrl: data.youtubeUrl || '',
          notes: data.notes || '',
          propertyType: data.propertyType || '',
          generalInfo
        });
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, toast]);

  const savePropertyData = useCallback(async () => {
    if (!formData) return;
    
    setIsSaving(true);
    try {
      // Ensure propertyId is a string
      const id = typeof propertyId === 'string' ? propertyId : '';
      
      if (!id) {
        console.error('Invalid property ID for saving:', propertyId);
        throw new Error('Invalid property ID');
      }
      
      const preparedData = {
        title: formData.title,
        price: formData.price,
        address: formData.address,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        livingArea: formData.livingArea,
        buildYear: formData.buildYear,
        garages: formData.garages,
        energyLabel: formData.energyLabel,
        hasGarden: formData.hasGarden,
        description: formData.description,
        shortDescription: formData.shortDescription,
        location_description: formData.location_description,
        features: JSON.stringify(formData.features),
        areas: JSON.stringify(formData.areas),
        nearby_places: JSON.stringify(formData.nearby_places),
        nearby_cities: JSON.stringify(formData.nearby_cities),
        latitude: formData.latitude,
        longitude: formData.longitude,
        object_id: formData.object_id,
        agent_id: formData.agent_id,
        template_id: formData.template_id,
        floorplanEmbedScript: formData.floorplanEmbedScript,
        virtualTourUrl: formData.virtualTourUrl,
        youtubeUrl: formData.youtubeUrl,
        notes: formData.notes,
        propertyType: formData.propertyType,
        generalInfo: JSON.stringify(formData.generalInfo)
      };
      
      const { error } = await supabase
        .from('properties')
        .update(preparedData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Property data saved successfully',
      });
      
      setPendingChanges(false);
    } catch (error) {
      console.error('Error saving property data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save property data',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, propertyId, toast]);

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId, fetchPropertyData]);

  const updateFormData = useCallback((updatedData: Partial<PropertyFormData>) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedData };
    });
    setPendingChanges(true);
  }, []);

  return {
    formData,
    updateFormData,
    isLoading,
    isSaving,
    savePropertyData,
    pendingChanges,
    setPendingChanges,
    refreshData: fetchPropertyData
  };
}
