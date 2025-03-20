import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export function usePropertySettings(propertyId: string, onSaveCallback: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

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
      
      const { data: currentData } = await supabase
        .from('properties')
        .select('object_id')
        .eq('id', propertyId)
        .single();
        
      const currentObjectId = currentData?.object_id || '';
      
      const { error } = await supabase
        .from('properties')
        .update({ object_id: objectId })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      await logPropertyChange(
        propertyId,
        "object_id",
        currentObjectId,
        objectId
      );
      
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
      
      const { data: currentData } = await supabase
        .from('properties')
        .select('agent_id')
        .eq('id', propertyId)
        .single();
        
      let oldAgentName = "No agent";
      let newAgentName = "No agent";
      
      if (currentData?.agent_id) {
        const { data: oldAgentData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentData.agent_id)
          .single();
          
        oldAgentName = oldAgentData?.full_name || "Unknown agent";
      }
      
      const finalAgentId = agentId === "" ? null : agentId;
      
      if (finalAgentId) {
        const { data: newAgentData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', finalAgentId)
          .single();
          
        newAgentName = newAgentData?.full_name || "Unknown agent";
      }
      
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: finalAgentId })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      await logPropertyChange(
        propertyId,
        "agent_assignment",
        oldAgentName,
        newAgentName
      );
      
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

  return {
    isUpdating,
    handleSaveObjectId,
    handleSaveAgent
  };
}
