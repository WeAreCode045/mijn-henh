import { PropertyFormData } from '@/types/property';
import { usePropertyFormSubmit } from '@/hooks/usePropertyFormSubmit';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export function usePropertyFormActions(
  formData: PropertyFormData,
  setPendingChanges: (pending: boolean) => void,
  setLastSaved: (date: Date | null) => void
) {
  const { handleSubmit } = usePropertyFormSubmit();
  const { toast } = useToast();

  // Handle saving object ID
  const handleSaveObjectId = async (objectId: string): Promise<void> => {
    console.log("Saving object ID:", objectId);
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ object_id: objectId })
        .eq('id', formData.id);
      
      if (error) throw error;
      
      toast({
        description: "Object ID saved successfully",
      });
      
      setPendingChanges(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving object ID:', error);
      toast({
        title: "Error",
        description: "Failed to save object ID",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Handle saving agent
  const handleSaveAgent = async (agentId: string | null): Promise<void> => {
    console.log("usePropertyFormActions - Saving agent ID:", agentId);
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }

    // Handle null values or empty strings properly
    const finalAgentId = agentId === null || (typeof agentId === 'string' && agentId.trim() === '') ? null : agentId;
    
    console.log("Agent ID to save:", agentId);
    console.log("Final Agent ID:", finalAgentId);
    console.log("Property ID:", formData.id);

    try {
      console.log("Updating properties table with:", { agent_id: finalAgentId, property_id: formData.id });
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: finalAgentId })
        .eq('id', formData.id);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast({
        description: "Agent assigned successfully",
      });
      
      setPendingChanges(true);
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleAgentChange = (selectedAgentId: string) => {
    console.log("AgentSelector: Selected agent ID:", selectedAgentId);
    handleSaveAgent(selectedAgentId);
  };

  const onSubmit = () => {
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
  };

  useEffect(() => {
    const fetchPropertyData = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', formData.id);
  
      if (error) {
        console.error("Error fetching property data:", error);
        return;
      }
  
      if (data) {
        console.log("Fetched property data:", data);
        // Update state only if necessary
      }
    };
  
    fetchPropertyData();
  }, [formData.id]);

  return {
    handleSaveObjectId,
    handleSaveAgent,
    handleAgentChange,
    onSubmit
  };
}
