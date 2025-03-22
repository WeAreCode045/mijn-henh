
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useSaveStatus() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const { toast } = useToast();
  
  // Handle form submission
  const onSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save the property
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      setPendingChanges(false);
      
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  return {
    lastSaved,
    setLastSaved,
    isSaving,
    setIsSaving,
    pendingChanges,
    setPendingChanges,
    onSubmit
  };
}
