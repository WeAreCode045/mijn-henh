
import React, { useState } from "react";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { usePropertyFormContainerData } from "@/hooks/property-form/usePropertyFormContainerData";
import { usePropertyFormContainerActions } from "@/hooks/property-form/usePropertyFormContainerActions";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyFormLoader } from "@/components/property/form/PropertyFormLoader";
import { PropertyForm } from "@/components/PropertyForm";

export function PropertyFormContainer() {
  const { isAdmin } = useAuth();
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);
  
  const {
    id,
    formData,
    setFormData,
    isLoading,
    settings,
    agents,
    selectedAgent,
    setSelectedAgent,
    templateInfo,
    setIsSubmitting,
    toast
  } = usePropertyFormContainerData();

  const {
    deleteProperty,
    handleAgentChange,
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyFormContainerActions(
    formData,
    setFormData,
    setIsSubmitting,
    setSelectedAgent,
    setAgentInfo,
    toast,
    agents
  );

  if (isLoading || !formData) {
    return <PropertyFormLoader />;
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
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      images={images}
      agentInfo={agentInfo}
      templateInfo={templateInfo}
      onSaveProperty={() => console.log("Save property functionality has been disabled")}
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
