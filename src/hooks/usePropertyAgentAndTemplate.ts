
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";

export function usePropertyAgentAndTemplate(formData: PropertyFormData | null) {
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const [templateInfo, setTemplateInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!formData) return;

    if (formData.agent_id) {
      // Fetch agent info
      const fetchAgentInfo = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', formData.agent_id)
            .single();
          
          if (data) {
            setAgentInfo({ id: data.id, name: data.full_name });
          }
        } catch (error) {
          console.error("Error fetching agent info:", error);
        }
      };

      fetchAgentInfo();
    }

    // Set default template info
    setTemplateInfo({ id: 'default', name: 'Default Template' });

    // Try to fetch actual template if we have one
    if (formData.template_id && formData.template_id !== 'default') {
      const fetchTemplateInfo = async () => {
        try {
          const { data } = await supabase
            .from('brochure_templates')
            .select('id, name')
            .eq('id', formData.template_id)
            .single();
          
          if (data) {
            setTemplateInfo({ id: data.id, name: data.name });
          }
        } catch (error) {
          console.error("Error fetching template info:", error);
        }
      };

      fetchTemplateInfo();
    }
  }, [formData?.agent_id, formData?.template_id, formData]);

  return { agentInfo, templateInfo };
}
