
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PropertyFormData } from '@/types/property';

export function useLocationBase(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const { toast } = useToast();
  
  return {
    isLoading,
    setIsLoading,
    isGeneratingMap,
    setIsGeneratingMap,
    toast,
    formData,
    onFieldChange
  };
}
