
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyAreaPhotos } from "@/hooks/images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { supabase } from "@/integrations/supabase/client";

export function PropertyFormContainer() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { settings } = useAgencySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templateInfo, setTemplateInfo] = useState<{id: string, name: string} | null>(null);
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);

  // Load property data
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);
  const { handleSubmit } = usePropertyFormSubmit();

  // Fetch template info and agent info
  useEffect(() => {
    if (formData && formData.id) {
      // Fetch template info
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
        
        // Set default if no template or fetching failed
        setTemplateInfo({ id: 'default', name: 'Default Template' });
      };

      // Fetch agent info if agent_id exists
      const fetchAgentInfo = async () => {
        if (formData.agent_id) {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', formData.agent_id)
            .single();
          
          if (data) {
            setAgentInfo({ id: data.id, name: data.full_name });
          }
        }
      };

      fetchTemplateInfo();
      fetchAgentInfo();
    }
  }, [formData]);

  // Load property image handlers
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
      // Pass false for shouldRedirect to prevent navigation after save
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

  return (
    <PropertyFormLayout
      title={id ? "Edit Property" : "Add New Property"}
      propertyData={formData || { id: "" } as any}
      settings={settings}
      isAdmin={isAdmin}
      agents={agents}
      selectedAgent={selectedAgent}
      onAgentSelect={setSelectedAgent}
      onDeleteProperty={deleteProperty}
      onSaveProperty={saveProperty}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      images={images.map(img => img.url)} // Convert PropertyImage[] to string[] by extracting the URL
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      isSubmitting={isSubmitting}
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
