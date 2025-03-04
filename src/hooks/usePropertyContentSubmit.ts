
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

  const onSubmit = () => {
    console.log("Submit clicked in PropertyContentTab");
    if (externalOnSubmit) {
      externalOnSubmit();
    } else {
      console.log("Form submitted in PropertyContentTab");
      
      // Final save when clicking submit
      if (formData.id) {
        const formEvent = {} as React.FormEvent;
        handleSubmit(formEvent, formData, false)
          .then((success) => {
            if (success) {
              setLastSaved(new Date());
              setPendingChanges(false);
              toast({
                title: "Success",
                description: "All changes have been saved",
              });
            }
          })
          .catch((error) => {
            console.error("Final save failed:", error);
            toast({
              title: "Error",
              description: "Failed to save all changes",
              variant: "destructive",
            });
          });
      }
    }
  };

  return { onSubmit };
}
