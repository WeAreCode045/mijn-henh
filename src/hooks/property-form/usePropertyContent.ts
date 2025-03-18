
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PropertyFormData } from '@/types/property';
import { fetchPropertyDataFromApi } from './operations/propertyFetchOperations';
import { savePropertyDataToApi } from './operations/propertySaveOperations';
import { shouldFetchProperty } from './utils/dataTransformationUtils';

export function usePropertyContent(propertyId: string | any) {
  const [formData, setFormData] = useState<PropertyFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const { toast } = useToast();

  const fetchPropertyData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPropertyDataFromApi(propertyId);
      if (data) {
        setFormData(data);
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
      await savePropertyDataToApi(propertyId, formData);
      
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
    if (shouldFetchProperty(propertyId)) {
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
