
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
  const handleSaveObjectId = (objectId: string) => {
    console.log("Saving object ID:", objectId);
    setPendingChanges(true);
    return objectId;
  };

  // Handle saving agent
  const handleSaveAgent = async (agentId: string) => {
    console.log("Saving agent ID:", agentId);
    
    // If agentId is empty, we want to set it to null in the database
    const finalAgentId = agentId.trim() === '' ? null : agentId;
    
    // If we have a property ID, update it immediately in the database
    if (formData.id) {
      try {
        const { error } = await supabase
          .from('properties')
          .update({ agent_id: finalAgentId })
          .eq('id', formData.id);
        
        if (error) {
          console.error("Error updating agent:", error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
      } catch (error) {
        console.error("Error updating agent:", error);
        toast({
          title: "Error",
          description: "Failed to update agent",
          variant: "destructive",
        });
      }
    }
    
    setPendingChanges(true);
    return agentId;
  };

  // Handle saving template
  const handleSaveTemplate = (templateId: string) => {
    console.log("Saving template ID:", templateId);
    setPendingChanges(true);
    return templateId;
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
