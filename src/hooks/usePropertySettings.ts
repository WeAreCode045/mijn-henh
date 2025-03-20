
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertySettings(propertyId: string, onSaveCallback: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSaveObjectId = async (objectId: string): Promise<void> => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
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
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving object ID:', error);
      toast({
        title: "Error",
        description: "Failed to save object ID",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveAgent = async (agentId: string): Promise<void> => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }

    try {
      setIsUpdating(true);
      
      // If agentId is empty string, set it to null in the database
      const finalAgentId = agentId === "" ? null : agentId;
      
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: finalAgentId })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        description: "Agent assigned successfully",
      });
      
      onSaveCallback();
      return Promise.resolve();
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTemplate = async (templateId: string): Promise<void> => {
    if (!propertyId) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }

    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('properties')
        .update({ template_id: templateId })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      toast({
        description: "Template assigned successfully",
      });
      
      onSaveCallback();
      return Promise.resolve();
    } catch (error) {
      console.error('Error assigning template:', error);
      toast({
        title: "Error",
        description: "Failed to assign template",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  };
}
