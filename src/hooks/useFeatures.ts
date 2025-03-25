
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFeature } from '@/types/property';

export function useFeatures(propertyId: string) {
  const [features, setFeatures] = useState<PropertyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalFeatures, setGlobalFeatures] = useState<PropertyFeature[]>([]);
  const { toast } = useToast();

  // Fetch features for a property
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoading(true);
        
        // Fetch property features
        const { data: propertyData } = await supabase
          .from('properties')
          .select('features')
          .eq('id', propertyId)
          .single();
        
        if (propertyData && propertyData.features) {
          const parsedFeatures = typeof propertyData.features === 'string' 
            ? JSON.parse(propertyData.features) 
            : propertyData.features;
          
          setFeatures(Array.isArray(parsedFeatures) ? parsedFeatures : []);
        }
        
        // Fetch global features
        const { data: globalData, error: globalError } = await supabase
          .from('property_features')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (globalError) throw globalError;
        
        setGlobalFeatures(globalData as PropertyFeature[]);
      } catch (error) {
        console.error('Error fetching features:', error);
        toast({
          title: 'Error',
          description: 'Failed to load property features',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchFeatures();
    }
  }, [propertyId, toast]);

  // Add a feature
  const addFeature = async (description: string) => {
    try {
      const newFeature: PropertyFeature = {
        id: crypto.randomUUID(),
        description,
      };
      
      const updatedFeatures = [...features, newFeature];
      setFeatures(updatedFeatures);
      
      const { error } = await supabase
        .from('properties')
        .update({ features: JSON.stringify(updatedFeatures) })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Feature added successfully',
      });
    } catch (error) {
      console.error('Error adding feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to add feature',
        variant: 'destructive',
      });
    }
  };

  // Remove a feature
  const removeFeature = async (featureId: string) => {
    try {
      const updatedFeatures = features.filter(feature => feature.id !== featureId);
      setFeatures(updatedFeatures);
      
      const { error } = await supabase
        .from('properties')
        .update({ features: JSON.stringify(updatedFeatures) })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Feature removed successfully',
      });
    } catch (error) {
      console.error('Error removing feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove feature',
        variant: 'destructive',
      });
    }
  };

  // Add a global feature to this property
  const addGlobalFeature = async (globalFeature: PropertyFeature) => {
    try {
      // Check if the feature is already added
      const isAlreadyAdded = features.some(f => f.id === globalFeature.id);
      if (isAlreadyAdded) return;
      
      const updatedFeatures = [...features, globalFeature];
      setFeatures(updatedFeatures);
      
      const { error } = await supabase
        .from('properties')
        .update({ features: JSON.stringify(updatedFeatures) })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Global feature added to property',
      });
    } catch (error) {
      console.error('Error adding global feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to add global feature',
        variant: 'destructive',
      });
    }
  };

  return {
    features,
    globalFeatures,
    isLoading,
    addFeature,
    removeFeature,
    addGlobalFeature
  };
}
