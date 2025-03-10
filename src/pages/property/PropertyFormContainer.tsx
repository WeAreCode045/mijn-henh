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
import { PropertyFormActions } from "./components/PropertyFormActions";
import { PropertyFormLoading } from "./components/PropertyFormLoading";
import { usePropertyDeletion } from "@/hooks/usePropertyDeletion";
import { useTemplateInfo } from "@/hooks/useTemplateInfo";
import { useAgentInfo } from "@/hooks/useAgentInfo";

export function PropertyFormContainer() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { settings } = useAgencySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Core property data hooks
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);
  const { handleSubmit } = usePropertyFormSubmit();
  const { deleteProperty } = usePropertyDeletion();
  
  // Load template and agent info
  const { templateInfo } = useTemplateInfo(formData?.template_id);
  const { agentInfo, setAgentInfo } = useAgentInfo(formData?.agent_id);

  // Image handling
  const {
    handleImageUpload,
    handleRemoveImage,
    images,
  } = usePropertyImages(formData, setFormData);

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
    return <PropertyFormLoading />;
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
      onDeleteProperty={() => deleteProperty(id)}
      onSaveProperty={saveProperty}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      images={images.map(img => typeof img === 'string' ? img : img.url)}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      isSubmitting={isSubmitting}
      actionButtons={
        <PropertyFormActions 
          isSubmitting={isSubmitting}
          onSave={saveProperty}
          onDelete={() => deleteProperty(id)}
          showDelete={!!id}
        />
      }
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
