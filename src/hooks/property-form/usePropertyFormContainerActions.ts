import { useNavigate } from "react-router-dom";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { PropertyFormData } from "@/types/property";
import { usePropertyDeletion } from "@/hooks/usePropertyDeletion";
import { supabase } from "@/integrations/supabase/client";

export function usePropertyFormContainerActions(
  formData: PropertyFormData | null,
  setFormData: (data: PropertyFormData) => void,
  setIsSubmitting: (value: boolean) => void,
  setSelectedAgent: (agentId: string) => void,
  setAgentInfo: (info: { id: string; name: string } | null) => void,
  toast: any,
  agents: any[]
) {
  const navigate = useNavigate();
  const { handleSubmit } = usePropertyFormSubmit();
  const { deleteProperty } = usePropertyDeletion();
  
  // Pass formData directly - the usePropertyImages hook now handles null values
  const { handleImageUpload, handleRemoveImage, images } = usePropertyImages(
    formData, 
    setFormData
  );

  const deletePropertyHandler = async () => {
    if (!formData?.id) {
      console.warn("Cannot delete property - missing property ID");
      toast({
        title: "Error",
        description: "Cannot delete property - missing property data",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await deleteProperty(formData.id);
      // Navigation is handled inside deleteProperty
    } catch (error) {
      console.error("Error in deletePropertyHandler:", error);
      toast({
        title: "Error",
        description: "Failed to delete property completely",
        variant: "destructive",
      });
    }
  };

  const saveProperty = async () => {
    if (!formData) {
      console.warn("Cannot save property - missing property data");
      toast({
        title: "Error",
        description: "Cannot save property - missing property data",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const event = {} as React.FormEvent;
      // Pass false as the third parameter to prevent any redirection
      const result = await handleSubmit(event, formData, false);
      
      if (result) {
        toast({
          title: "Success",
          description: "Property saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgentChange = async (agentId: string): Promise<void> => {
    console.log("usePropertyFormContainerActions - handleAgentChange called with:", agentId);
    
    if (!formData) {
      console.error("FormData is null in handleAgentChange");
      toast({
        title: "Error",
        description: "Cannot update agent - missing property data",
        variant: "destructive",
      });
      return Promise.reject(new Error("Form data is missing"));
    }
    
    // Set to null if it's an empty string or "no-agent"
    const finalAgentId = agentId === "no-agent" || agentId.trim() === '' ? null : agentId;
    
    // Update the UI state
    setSelectedAgent(finalAgentId || '');
    
    // Update the form data with the selected agent
    setFormData({
      ...formData,
      agent_id: finalAgentId
    });
    
    // If we have a property ID, update it in the database
    if (formData.id) {
      try {
        console.log("Updating agent_id to:", finalAgentId, "for property:", formData.id);
        
        // Direct database update using Supabase
        const { error, data } = await supabase
          .from('properties')
          .update({ agent_id: finalAgentId })
          .eq('id', formData.id)
          .select();
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Agent update result:", data);
        
        // Find the agent info to display
        if (finalAgentId) {
          const agent = agents.find(a => a.id === finalAgentId);
          if (agent) {
            // Use display_name if it exists, otherwise try to build from first_name and last_name
            const agentName = agent.display_name || 
              `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 
              'Unnamed Agent';
            
            setAgentInfo({ id: agent.id, name: agentName });
          } else {
            setAgentInfo(null);
          }
        } else {
          setAgentInfo(null);
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
    }
    
    return Promise.resolve();
  };

  return {
    deleteProperty: deletePropertyHandler,
    saveProperty,
    handleAgentChange,
    handleImageUpload,
    handleRemoveImage,
    // Ensure images is an array even if it's undefined
    images: Array.isArray(images) ? images.map(img => typeof img === 'string' ? img : img.url) : []
  };
}
