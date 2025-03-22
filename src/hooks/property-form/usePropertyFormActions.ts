
import { useCallback } from "react";
import { PropertyFormData } from "@/types/property";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFormActions(
  formState: PropertyFormData,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const { toast } = useToast();
  
  const handleSaveObjectId = useCallback(async (objectId: string) => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID missing. Cannot update object ID.",
        variant: "destructive",
      });
      return Promise.reject("Property ID missing");
    }
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ object_id: objectId })
        .eq('id', formState.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Object ID updated successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating object ID:", error);
      toast({
        title: "Error",
        description: "Failed to update object ID",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  }, [formState.id, toast]);
  
  const handleSaveAgent = useCallback(async (agentId: string) => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID missing. Cannot update agent.",
        variant: "destructive",
      });
      return Promise.reject("Property ID missing");
    }
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: agentId })
        .eq('id', formState.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Agent updated successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  }, [formState.id, toast]);
  
  const onSubmit = useCallback(() => {
    // This is a placeholder for the actual submit function
    // The real implementation would update the property in the database
    setPendingChanges(false);
    setLastSaved(new Date());
  }, [setPendingChanges, setLastSaved]);
  
  return {
    handleSaveObjectId,
    handleSaveAgent,
    onSubmit
  };
}
