
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useToast } from "@/components/ui/use-toast";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { PropertyData } from "@/types/property";

export const usePropertyFormContainerData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { formData, isLoading, error } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect();
  const [saving, setSaving] = useState(false);

  // Set form title based on data
  useEffect(() => {
    if (formData?.title) {
      document.title = `Editing: ${formData.title}`;
    } else {
      document.title = "New Property";
    }
    
    return () => {
      document.title = "Property Manager";
    };
  }, [formData?.title]);

  // Select the current agent when form data loads
  useEffect(() => {
    if (formData?.agent_id && agents.length > 0 && !selectedAgent) {
      const currentAgent = agents.find(agent => agent.id === formData.agent_id);
      if (currentAgent) {
        setSelectedAgent(currentAgent);
      }
    }
  }, [formData, agents, selectedAgent, setSelectedAgent]);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleViewProperty = () => {
    if (id) {
      navigate(`/property/${id}/webview`);
    }
  };

  return {
    id,
    formData,
    isLoading,
    error,
    agents, 
    saving,
    setSaving,
    handleGoBack,
    handleViewProperty
  };
};

export default usePropertyFormContainerData;
