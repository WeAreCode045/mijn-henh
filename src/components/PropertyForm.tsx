
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PropertyTabsWrapper } from "./property/PropertyTabsWrapper";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/types/property";

export function PropertyForm() {
  const { id } = useParams();
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const [templateInfo, setTemplateInfo] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (formData?.agent_id) {
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
    if (formData?.template_id && formData.template_id !== 'default') {
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
  }, [formData?.agent_id, formData?.template_id]);

  // Modified to avoid conflicts with content tab save
  const handleSave = () => {
    // Only show a toast, don't trigger any actual save
    // This function is not used for actual saving anymore
    console.log("PropertyForm.handleSave called - this is just a refresh notification");
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.resolve();
    }
    
    try {
      setIsDeleting(true);
      
      // Here would be the actual delete logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      
      // Navigate would happen in the container component
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="p-4 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Ensure formData has an id property by casting it to PropertyData
  // This is safe because we've already checked that formData is not null
  const propertyData: PropertyData = {
    ...formData,
    id: formData.id || '', // Provide empty string as fallback if id is missing
  };

  return (
    <div className="space-y-4">
      <form id="propertyForm">
        <PropertyTabsWrapper
          property={propertyData}
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
