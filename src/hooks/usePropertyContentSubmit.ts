
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";

export function usePropertyContentSubmit(
  formData: PropertyFormData,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void,
  externalOnSubmit?: () => void
) {
  const { toast } = useToast();
  const { handleSubmit } = usePropertyFormSubmit();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async () => {
    console.log("Submit clicked in PropertyContentTab");
    if (!formData) {
      console.error("No form data to save");
      toast({
        title: "Error",
        description: "No data to save",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // If there's an external submit handler provided, use that
      if (externalOnSubmit) {
        console.log("Using external submit handler");
        await externalOnSubmit();
        setLastSaved(new Date());
        setPendingChanges(false);
        toast({
          title: "Success",
          description: "All changes have been saved",
        });
        return;
      }
      
      // Final save when clicking submit
      if (formData.id) {
        try {
          console.log("Submitting form data:", formData);
          
          // Create a form event to pass to handleSubmit
          const formEvent = {} as React.FormEvent;
          // Pass the current formData and set redirectAfterSave to false
          const success = await handleSubmit(formEvent, formData, false);
          
          if (success) {
            console.log("Save successful");
            setLastSaved(new Date());
            setPendingChanges(false);
            toast({
              title: "Success",
              description: "All changes have been saved",
            });
          } else {
            console.error("Save returned false");
            toast({
              title: "Error",
              description: "Failed to save changes",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Save error:", error);
          toast({
            title: "Error",
            description: "Failed to save changes",
            variant: "destructive",
          });
        }
      } else {
        console.error("No property ID found");
        toast({
          title: "Error",
          description: "Property ID is missing",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return { onSubmit, isSaving };
}
