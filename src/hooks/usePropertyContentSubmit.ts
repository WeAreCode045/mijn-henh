
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

  const onSubmit = async () => {
    console.log("Submit clicked in PropertyContentTab");
    
    if (externalOnSubmit) {
      console.log("Using external onSubmit function");
      externalOnSubmit();
      return;
    }
    
    console.log("Form submitted in PropertyContentTab");
    
    // Final save when clicking submit
    if (formData.id) {
      try {
        const formEvent = {} as React.FormEvent;
        const success = await handleSubmit(formEvent, formData, false);
        
        if (success) {
          setLastSaved(new Date());
          setPendingChanges(false);
          toast({
            title: "Success",
            description: "All changes have been saved",
          });
        }
      } catch (error) {
        console.error("Final save failed:", error);
        toast({
          title: "Error",
          description: "Failed to save all changes",
          variant: "destructive",
        });
      }
    } else {
      console.error("Cannot save: formData.id is missing", formData);
      toast({
        title: "Error",
        description: "Cannot save property: missing ID",
        variant: "destructive",
      });
    }
  };

  return { onSubmit };
}
