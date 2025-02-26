
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";

export function usePropertyFormSubmit(onSubmit: (data: PropertyFormData) => void) {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, formData: PropertyFormData) => {
    e.preventDefault();
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const id = formData.id || crypto.randomUUID();
      
      await onSubmit(formData);
      
      toast({
        title: "Success",
        description: "Property saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
