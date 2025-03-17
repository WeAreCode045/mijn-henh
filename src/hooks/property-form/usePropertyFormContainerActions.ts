
import { useNavigate } from "react-router-dom";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";

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
  
  const { handleImageUpload, handleRemoveImage, images } = usePropertyImages(
    formData, 
    setFormData
  );

  const deleteProperty = async () => {
    if (!formData?.id) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', formData.id);
        
      if (error) throw error;
      
      navigate('/properties');
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const handleAgentChange = async (agentId: string) => {
    if (!formData) return;
    
    // Set to null if it's an empty string or "no-agent"
    const finalAgentId = agentId === "no-agent" || agentId.trim() === '' ? null : agentId;
    
    setSelectedAgent(finalAgentId || '');
    
    // Update the form data with the selected agent
    setFormData({
      ...formData,
      agent_id: finalAgentId
    });
    
    // If we have a property ID, update it in the database
    if (formData.id) {
      try {
        const { error } = await supabase
          .from('properties')
          .update({ agent_id: finalAgentId })
          .eq('id', formData.id);
        
        if (error) throw error;
        
        // Find the agent info to display
        if (finalAgentId) {
          const agent = agents.find(a => a.id === finalAgentId);
          if (agent) {
            setAgentInfo({ id: agent.id, name: agent.full_name });
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
      } catch (error) {
        console.error("Error updating agent:", error);
        toast({
          title: "Error",
          description: "Failed to update agent",
          variant: "destructive",
        });
      }
    }
  };

  return {
    deleteProperty,
    handleAgentChange,
    handleImageUpload,
    handleRemoveImage,
    images: images.map(img => typeof img === 'string' ? img : img.url)
  };
}
