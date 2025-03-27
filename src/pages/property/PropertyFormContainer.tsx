
import React, { useState, useEffect } from "react";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { usePropertyFormContainerData } from "@/hooks/property-form/usePropertyFormContainerData";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyFormLoader } from "@/components/property/form/PropertyFormLoader";
import { useAgentSelect } from "@/hooks/useAgentSelect";

export function PropertyFormContainer() {
  const { isAdmin } = useAuth();
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();
  const { selectedAgent, setSelectedAgent } = useAgentSelect();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    id,
    formData,
    isLoading,
    agents,
    saving,
    setSaving,
    handleGoBack,
    handleViewProperty
  } = usePropertyFormContainerData();

  // Get property form data
  const { setFormData } = usePropertyForm(id);

  // Get the settings here directly
  const [settings, setSettings] = useState(null);

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
      settings={settings}
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
