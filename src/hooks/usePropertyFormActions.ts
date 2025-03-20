
import { PropertyFormData } from "@/types/property";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      return;
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
    } catch (error) {
      console.error('Error saving object ID:', error);
      toast({
        title: "Error",
        description: "Failed to save object ID",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handle saving agent
  const handleSaveAgent = async (agentId: string): Promise<void> => {
    console.log("Saving agent ID:", agentId);
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    // If agentId is empty string, we want to set it to null in the database
    const finalAgentId = agentId.trim() === '' ? null : agentId;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: finalAgentId })
        .eq('id', formData.id);
      
      if (error) throw error;
      
      toast({
        description: "Agent assigned successfully",
      });
      
      setPendingChanges(true);
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handle saving template
  const handleSaveTemplate = async (templateId: string): Promise<void> => {
    console.log("Saving template ID:", templateId);
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ template_id: templateId })
        .eq('id', formData.id);
      
      if (error) throw error;
      
      toast({
        description: "Template assigned successfully",
      });
      
      setPendingChanges(true);
    } catch (error) {
      console.error('Error assigning template:', error);
      toast({
        title: "Error",
        description: "Failed to assign template",
        variant: "destructive",
      });
      throw error;
    }
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

  return {
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate,
    onSubmit
  };
}
