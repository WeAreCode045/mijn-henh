
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";

export function usePropertySubmit() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDatabaseSubmit = async (data: PropertySubmitData, id?: string) => {
    try {
      // Log the complete data object for debugging
      console.log("Full data being submitted to database:", JSON.stringify(data));
      
      // Make sure areas data is properly formatted as JSONB
      if (Array.isArray(data.areas)) {
        console.log("Areas before final formatting:", JSON.stringify(data.areas));
      }
      
      if (id) {
        console.log(`Updating property ${id} with areas:`, JSON.stringify(data.areas));
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
        console.log("Creating new property with areas:", JSON.stringify(data.areas));
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
