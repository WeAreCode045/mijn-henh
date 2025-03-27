
import React, { useState } from "react";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyFormLoader } from "@/components/property/form/PropertyFormLoader";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { useParams } from "react-router-dom";

export function PropertyFormContainer() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();
  const { selectedAgent, setSelectedAgent } = useAgentSelect();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get property form data
  const { formData, isLoading } = usePropertyForm(id);

  // Add a simplified mock for agents
  const agents = [];
  const saving = false;

  const {
    deleteProperty,
    saveProperty,
    handleAgentChange,
    handleImageUpload,
    handleRemoveImage,
    images
  } = {
    deleteProperty: async () => {},
    saveProperty: async () => {},
    handleAgentChange: async (agentId: string) => {}, 
    handleImageUpload: async () => {},
    handleRemoveImage: async () => {},
    images: []
  };

  if (isLoading || !formData) {
    return <PropertyFormLoader />;
  }

  return (
    <PropertyFormLayout
      title={formData.title || "Edit Property"}
      propertyData={formData || { id: "" } as any}
      settings={null}
      isAdmin={isAdmin}
      agents={agents}
      selectedAgent={selectedAgent ? selectedAgent.id : ""}
      onAgentSelect={handleAgentChange}
      onDeleteProperty={deleteProperty}
      onSaveProperty={saveProperty}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      images={images}
      agentInfo={agentInfo}
      isSubmitting={isSubmitting}
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
