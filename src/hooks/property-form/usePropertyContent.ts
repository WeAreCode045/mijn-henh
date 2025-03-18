
import { useState } from 'react';
import { fetchPropertyDataFromApi } from './operations/propertyFetchOperations';
import { savePropertyDataToApi } from './operations/propertySaveOperations';
import { PropertyFormData } from '@/types/property';
import { shouldFetchProperty } from './utils/dataTransformationUtils';

export function usePropertyContent(propertyId: string | undefined) {
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  
  // Function to fetch/refresh data
  const refreshData = async () => {
    if (!shouldFetchProperty(propertyId)) {
      console.warn('Cannot fetch property - invalid ID:', propertyId);
      return null;
    }
    
    try {
      const data = await fetchPropertyDataFromApi(propertyId);
      return data;
    } catch (error) {
      console.error('Error fetching property data:', error);
      return null;
    }
  };
  
  // Function to save data
  const savePropertyData = async (formData: PropertyFormData) => {
    if (!propertyId) {
      console.error('Cannot save property - missing ID');
      return false;
    }
    
    setIsSaving(true);
    
    try {
      await savePropertyDataToApi(propertyId, formData);
      setPendingChanges(false);
      return true;
    } catch (error) {
      console.error('Error saving property data:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    refreshData,
    savePropertyData,
    isSaving,
    pendingChanges,
    setPendingChanges
  };
}
