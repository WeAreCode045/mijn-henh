
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
  const [templateInfo, setTemplateInfo] = useState<{id: string, name: string} | null>(null);
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);

  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);

  // Fetch template and agent info when formData changes
  useEffect(() => {
    if (formData && formData.id) {
      const fetchTemplateInfo = async () => {
        const templateId = formData.template_id || 'default';
        
        if (templateId !== 'default') {
          const { data } = await supabase
            .from('brochure_templates')
            .select('id, name')
            .eq('id', templateId)
            .single();
            
          if (data) {
            setTemplateInfo(data);
            return;
          }
        }
        
        setTemplateInfo({ id: 'default', name: 'Default Template' });
      };

      const fetchAgentInfo = async () => {
        if (formData.agent_id) {
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

      fetchTemplateInfo();
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
    templateInfo,
    agentInfo,
    isSubmitting,
    setIsSubmitting,
    toast
  };
}
