
import { PropertyFormData } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePropertySaveHandlers(
  formState: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void
) {
  const { toast } = useToast();

  const handleSaveObjectId = async (objectId: string): Promise<void> => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      onFieldChange('object_id', objectId);
      
      const { error } = await supabase
        .from('properties')
        .update({ object_id: objectId })
        .eq('id', formState.id);
      
      if (error) throw error;
      
      toast({
        description: "Object ID saved successfully",
      });
      
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

  const handleSaveAgent = async (agentId: string): Promise<void> => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      // If agentId is empty string, we want to set it to null in the database
      const finalAgentId = agentId.trim() === '' ? null : agentId;
      
      // Update local state
      onFieldChange('agent_id', finalAgentId);
      
      // Save to database
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: finalAgentId })
        .eq('id', formState.id);
      
      if (error) throw error;
      
      toast({
        description: "Agent assigned successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return {
    handleSaveObjectId,
    handleSaveAgent
  };
}
