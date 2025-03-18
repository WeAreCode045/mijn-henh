
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PropertyFormData } from '@/types/property';
import { fetchPropertyDataFromApi } from './operations/propertyFetchOperations';
import { savePropertyDataToApi } from './operations/propertySaveOperations';

export function usePropertyContent(id?: string) {
  const [pendingChanges, setPendingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Refresh data from API
  const refreshData = useCallback(async (): Promise<PropertyFormData | null> => {
    if (!id) return null;
    
    try {
      const data = await fetchPropertyDataFromApi(id);
      return data;
    } catch (error) {
      console.error('Error refreshing property data:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh property data',
        variant: 'destructive'
      });
      return null;
    }
  }, [id, toast]);

  // Save property data
  const savePropertyData = useCallback(async (formData: PropertyFormData): Promise<boolean> => {
    if (!id) return false;
    
    setIsSaving(true);
    
    try {
      await savePropertyDataToApi(id, formData);
      
      toast({
        title: 'Success',
        description: 'Property saved successfully'
      });
      
      setPendingChanges(false);
      return true;
    } catch (error) {
      console.error('Error saving property:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to save property',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [id, toast]);

  return {
    refreshData,
    savePropertyData,
    pendingChanges,
    setPendingChanges,
    isSaving
  };
}
