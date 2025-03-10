
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

export function PropertyFormContainer() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { settings } = useAgencySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateInfo, setTemplateInfo] = useState<{id: string, name: string} | null>(null);
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);

  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);
  const { handleSubmit } = usePropertyFormSubmit();

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

  const {
    handleImageUpload,
    handleRemoveImage,
    images,
  } = usePropertyImages(formData, setFormData);

  const deleteProperty = async () => {
    if (!id || !formData) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
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

  const saveProperty = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      const event = {} as React.FormEvent;
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

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PropertyFormLayout
      title={id ? "Edit Property" : "Add New Property"}
      propertyData={formData || { id: "" } as any}
      settings={settings}
      isAdmin={isAdmin}
      agents={agents}
      selectedAgent={selectedAgent}
      onAgentSelect={handleAgentChange}
      onDeleteProperty={deleteProperty}
      onSaveProperty={saveProperty}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      images={images.map(img => typeof img === 'string' ? img : img.url)}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      isSubmitting={isSubmitting}
      actionButtons={
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="default" 
            onClick={saveProperty} 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Property
          </Button>
          {id && (
            <Button 
              variant="destructive" 
              onClick={deleteProperty}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      }
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
