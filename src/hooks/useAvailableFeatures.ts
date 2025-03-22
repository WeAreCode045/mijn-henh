
import { useState, useEffect } from 'react';
import { PropertyFeature } from '@/types/property';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export function useAvailableFeatures() {
  const [availableFeatures, setAvailableFeatures] = useState<PropertyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available features from the database
  useEffect(() => {
    async function fetchFeatures() {
      try {
        setIsLoading(true);
        
        // Try to fetch from a property_features table if it exists
        const { data, error } = await supabase
          .from('property_features')
          .select('id, description')
          .order('description');
          
        if (error) {
          console.error("Error fetching features:", error);
          // Fallback to default features
          setAvailableFeatures(getDefaultFeatures());
        } else if (data && data.length > 0) {
          // Safely convert the data to PropertyFeature[]
          const typedFeatures = data.map((item: any) => ({
            id: String(item?.id || ''),
            description: String(item?.description || '')
          }));
          
          setAvailableFeatures(typedFeatures);
        } else {
          // No features found, use defaults
          setAvailableFeatures(getDefaultFeatures());
        }
      } catch (err) {
        console.error("Error in fetchFeatures:", err);
        setAvailableFeatures(getDefaultFeatures());
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeatures();
  }, []);

  // Add a new feature to the available features list
  const addFeature = async (description: string) => {
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: description.trim()
    };
    
    try {
      // Try to save to database if the table exists
      const { error } = await supabase
        .from('property_features')
        .insert([{ id: newFeature.id, description: newFeature.description }]);
      
      if (error) {
        console.error("Error saving feature:", error);
      }
      
      // Add to local state regardless of database success
      setAvailableFeatures(prev => [...prev, newFeature]);
      
      return newFeature;
    } catch (err) {
      console.error("Error in addFeature:", err);
      // Still add to local state even if DB fails
      setAvailableFeatures(prev => [...prev, newFeature]);
      return newFeature;
    }
  };

  // Add multiple features at once
  const addMultipleFeatures = async (features: PropertyFeature[]) => {
    // Filter out features that might already exist with the same description
    const uniqueFeatures = features.filter(
      newFeature => !availableFeatures.some(
        existing => existing.description.toLowerCase() === newFeature.description.toLowerCase()
      )
    );
    
    if (uniqueFeatures.length === 0) return [];
    
    try {
      // Try to save to database if the table exists
      const { error } = await supabase
        .from('property_features')
        .insert(
          uniqueFeatures.map(f => ({ id: f.id, description: f.description }))
        );
      
      if (error) {
        console.error("Error saving multiple features:", error);
      }
      
      // Add to local state regardless of database success
      setAvailableFeatures(prev => [...prev, ...uniqueFeatures]);
      
      return uniqueFeatures;
    } catch (err) {
      console.error("Error in addMultipleFeatures:", err);
      // Still add to local state even if DB fails
      setAvailableFeatures(prev => [...prev, ...uniqueFeatures]);
      return uniqueFeatures;
    }
  };

  // Get default features as a fallback
  const getDefaultFeatures = (): PropertyFeature[] => {
    return [
      { id: uuidv4(), description: 'Air Conditioning' },
      { id: uuidv4(), description: 'Balcony' },
      { id: uuidv4(), description: 'Dishwasher' },
      { id: uuidv4(), description: 'Elevator' },
      { id: uuidv4(), description: 'Fireplace' },
      { id: uuidv4(), description: 'Garden' },
      { id: uuidv4(), description: 'Gym' },
      { id: uuidv4(), description: 'Laundry Room' },
      { id: uuidv4(), description: 'Parking' },
      { id: uuidv4(), description: 'Pool' },
      { id: uuidv4(), description: 'Security System' },
      { id: uuidv4(), description: 'Storage Room' },
      { id: uuidv4(), description: 'Washer/Dryer' },
      { id: uuidv4(), description: 'Wheelchair Access' },
      { id: uuidv4(), description: 'WiFi' }
    ];
  };

  return {
    availableFeatures,
    isLoading,
    addFeature,
    addMultipleFeatures
  };
}
