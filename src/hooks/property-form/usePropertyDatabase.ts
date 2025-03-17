
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertySubmitData } from '@/types/property';

export function usePropertyDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  
  const createProperty = async (data: PropertySubmitData) => {
    setIsLoading(true);
    try {
      const { data: newProperty, error } = await supabase
        .from('properties')
        .insert([data])
        .select();
        
      if (error) {
        console.error('Error creating property:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in createProperty:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProperty = async (id: string, data: PropertySubmitData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id);
        
      if (error) {
        console.error('Error updating property:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in updateProperty:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteProperty = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting property:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in deleteProperty:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createProperty,
    updateProperty,
    deleteProperty,
    isLoading
  };
}
