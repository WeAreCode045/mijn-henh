
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PropertyTabsWrapper } from "./property/PropertyTabsWrapper";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { supabase } from "@/integrations/supabase/client";

export function PropertyForm() {
  const { id } = useParams();
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { settings } = useAgencySettings();
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const [templateInfo, setTemplateInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (formData?.agent_id) {
      // Fetch agent info
      const fetchAgentInfo = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', formData.agent_id)
          .single();
        
        if (data) {
          setAgentInfo({ id: data.id, name: data.full_name });
        }
      };

      fetchAgentInfo();
    }

    // Set default template info
    setTemplateInfo({ id: 'default', name: 'Default Template' });

    // Try to fetch actual template if we have one
    if (formData?.template_id) {
      const fetchTemplateInfo = async () => {
        const { data } = await supabase
          .from('brochure_templates')
          .select('id, name')
          .eq('id', formData.template_id)
          .single();
        
        if (data) {
          setTemplateInfo(data);
        }
      };

      fetchTemplateInfo();
    }
  }, [formData?.agent_id, formData?.template_id]);

  const handleSave = () => {
    // This will be passed to the form submit function via the PropertyFormContainer
    console.log("Save property from PropertyForm");
    // The actual save happens in the PropertyFormContainer
  };

  const handleDelete = async (): Promise<void> => {
    // This will be passed to the delete function via the PropertyFormContainer
    console.log("Delete property from PropertyForm");
    // The actual delete happens in the PropertyFormContainer
    return Promise.resolve();
  };

  if (isLoading || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <form id="propertyForm">
        <PropertyTabsWrapper
          property={formData}
          settings={settings}
          onSave={handleSave}
          onDelete={handleDelete}
          agentInfo={agentInfo}
          templateInfo={templateInfo}
        />
      </form>
    </div>
  );
}
