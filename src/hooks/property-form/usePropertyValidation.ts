
import { PropertyFormData } from "@/types/property";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyValidation() {
  const { toast } = useToast();
  
  const validatePropertyData = (formData: PropertyFormData | null | undefined): boolean => {
    if (!formData) {
      console.error("Form data is undefined or null");
      toast({
        title: "Error",
        description: "No form data available to submit",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  return { validatePropertyData };
}
