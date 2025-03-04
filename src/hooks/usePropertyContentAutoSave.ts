
import { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyContentAutoSave(
  formData: PropertyFormData,
  pendingChanges: boolean, 
  setPendingChanges: (pending: boolean) => void
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { handleSubmit } = usePropertyFormSubmit();
  const { toast } = useToast();
  
  // Auto-save functionality
  useEffect(() => {
    if (formData.id && pendingChanges) {
      const timer = setTimeout(() => {
        console.log("Auto-saving form data...");
        
        // Create a form event
        const formEvent = {} as React.FormEvent;
        
        // Call handleSubmit with the formData and false for shouldRedirect
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
          });
      }, 2000); // 2-second delay for auto-save
      
      return () => clearTimeout(timer);
    }
  }, [formData, pendingChanges, handleSubmit, toast, setPendingChanges]);

  return {
    lastSaved,
    setLastSaved
  };
}
