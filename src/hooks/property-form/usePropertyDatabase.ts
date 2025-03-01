import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PropertySubmitData } from "@/types/property";

export function usePropertyDatabase() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const updateProperty = async (id: string, data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyDatabase - Updating property with ID:", id);
    console.log("usePropertyDatabase - Update data:", JSON.stringify(data));
    
    try {
      const { error, data: updatedData } = await supabase
        .from('properties')
        .update(data as any)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      console.log("Property updated successfully:", updatedData);
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('usePropertyDatabase - Error updating property:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the property",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const createProperty = async (data: PropertySubmitData): Promise<boolean> => {
    console.log("usePropertyDatabase - Creating new property with data:", JSON.stringify(data));
    
    try {
      const { error, data: createdData } = await supabase
        .from('properties')
        .insert(data as any)
        .select();
        
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Property created successfully:", createdData);
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      return true;
    } catch (error) {
      console.error('usePropertyDatabase - Error creating property:', error);
      toast({
        title: "Error",
        description: "There was a problem creating the property",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { updateProperty, createProperty };
}
