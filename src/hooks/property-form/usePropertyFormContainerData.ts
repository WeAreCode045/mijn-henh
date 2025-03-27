
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePropertyFormContainerData() {
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);

  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);

  // Fetch agent info when formData changes
  useEffect(() => {
    if (formData && formData.id) {
      const fetchAgentInfo = async () => {
        if (formData.agent_id && formData.agent_id.trim() !== '') {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', formData.agent_id)
            .single();
          
          if (data) {
            setAgentInfo({ id: data.id, name: data.full_name });
          } else {
            setAgentInfo(null);
          }
        } else {
          setAgentInfo(null);
        }
      };

      fetchAgentInfo();
    }
  }, [formData]);

  return {
    id,
    formData,
    setFormData,
    isLoading,
    settings,
    agents,
    selectedAgent,
    setSelectedAgent,
    agentInfo,
    isSubmitting,
    setIsSubmitting,
    toast
  };
}
