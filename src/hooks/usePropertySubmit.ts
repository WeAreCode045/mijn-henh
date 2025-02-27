
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";

export function usePropertySubmit() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDatabaseSubmit = async (data: PropertySubmitData, id?: string) => {
    try {
      if (id) {
        console.log("Updating property with areas data:", data.areas);
        const { error: updateError } = await supabase
          .from('properties')
          .update(data)
          .eq('id', id);
        
        if (updateError) throw updateError;

        toast({
          title: "Property Updated",
          description: "The property has been saved successfully",
          variant: "default",
        });
      } else {
        console.log("Creating property with areas data:", data.areas);
        const { error: insertError } = await supabase
          .from('properties')
          .insert(data);
        
        if (insertError) throw insertError;

        toast({
          title: "Property Created",
          description: "The property has been saved successfully",
          variant: "default",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the property",
        variant: "destructive",
      });
    }
  };

  return { handleDatabaseSubmit };
}
