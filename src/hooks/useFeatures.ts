
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
        
        // Verify user is authenticated before fetching
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          console.log("No authenticated session found in useFeatures");
          setIsLoading(false);
          return;
        }
        
        // Fetch property features
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('features')
          .eq('id', propertyId)
          .maybeSingle();
        
        if (propertyError) {
          console.error("Error fetching property features:", propertyError);
          throw propertyError;
        }
        
        if (propertyData && propertyData.features) {
          let parsedFeatures: PropertyFeature[] = [];
          
          try {
            if (typeof propertyData.features === 'string') {
              parsedFeatures = JSON.parse(propertyData.features);
            } else if (Array.isArray(propertyData.features)) {
              // Ensure each feature has id and description
              parsedFeatures = (propertyData.features as any[]).map(feature => {
                // If feature is already a properly shaped object
                if (typeof feature === 'object' && feature !== null && 'id' in feature && 'description' in feature) {
                  return feature as PropertyFeature;
                }
                // If feature is just a string
                if (typeof feature === 'string') {
                  return {
                    id: crypto.randomUUID(),
                    description: feature
                  };
                }
                // If feature is an object but missing properties
                return {
                  id: feature?.id || crypto.randomUUID(),
                  description: feature?.description || String(feature) || ''
                };
              });
            } else if (typeof propertyData.features === 'object') {
              const feature = propertyData.features as Record<string, any>;
              parsedFeatures = [{
                id: feature.id || crypto.randomUUID(),
                description: feature.description || ''
              }];
            }
          } catch (parseError) {
            console.error("Error parsing features:", parseError);
            parsedFeatures = [];
          }
          
          setFeatures(Array.isArray(parsedFeatures) ? parsedFeatures : []);
        }
        
        // Fetch global features
        const { data: globalData, error: globalError } = await supabase
          .from('property_features')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (globalError) {
          console.error("Error fetching global features:", globalError);
          throw globalError;
        }
        
        setGlobalFeatures(globalData as PropertyFeature[] || []);
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
