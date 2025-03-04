
import { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyAutoSave(formData: PropertyFormData, formDataId?: string) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const { handleSubmit } = usePropertyFormSubmit();
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (formDataId && pendingChanges) {
      const timer = setTimeout(() => {
        console.log("Auto-saving property data...");
        setIsSaving(true);
        
        // Create a form event
        const formEvent = {} as React.FormEvent;
        
        // Call handleSubmit with the formState and false for shouldRedirect
        handleSubmit(formEvent, formData, false)
          .then((success) => {
            if (success) {
              setLastSaved(new Date());
              setPendingChanges(false);
              toast({
                description: "Changes saved automatically",
                duration: 2000,
              });
            }
          })
          .catch((error) => {
            console.error("Auto-save failed:", error);
            toast({
              title: "Auto-save failed",
              description: "Your changes couldn't be saved automatically",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsSaving(false);
          });
      }, 2000); // 2-second delay for auto-save
      
      return () => clearTimeout(timer);
    }
  }, [formData, pendingChanges, formDataId, handleSubmit, toast]);

  return {
    lastSaved,
    isSaving,
    pendingChanges,
    setPendingChanges,
    setLastSaved
  };
}
