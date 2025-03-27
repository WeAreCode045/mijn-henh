
import { useState, useEffect } from 'react';
import { usePropertyFetch } from './property-form/usePropertyFetch';

export function usePropertyForm(id: string | undefined) {
  const { formData, setFormData, isLoading } = usePropertyFetch(id);
  
  // Add additional debugging
  useEffect(() => {
    console.log("usePropertyForm - Property ID:", id);
    console.log("usePropertyForm - Has formData:", !!formData);
    if (formData) {
      console.log("usePropertyForm - Property title:", formData.title);
      console.log("usePropertyForm - Property ID from data:", formData.id);
    }
  }, [id, formData]);
  
  return { formData, setFormData, isLoading };
}
