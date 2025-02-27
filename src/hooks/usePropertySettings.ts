import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertySettings(propertyId: string, onSaveCallback: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSaveObjectId = async (objectId: string) => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('properties')
        .update({ object_id: objectId })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        description: "Object ID saved successfully",
      });
      
      onSaveCallback();
    } catch (error) {
      console.error('Error saving object ID:', error);
      toast({
        title: "Error",
        description: "Failed to save object ID",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveAgent = async (agentId: string) => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: agentId })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        description: "Agent assigned successfully",
      });
      
      onSaveCallback();
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTemplate = async (templateId: string) => {
    console.log("Template functionality disabled, ignoring update to:", templateId);
    return Promise.resolve();
  };

  return {
    isUpdating,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  };
}
