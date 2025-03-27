
import React, { useState, useEffect } from "react";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { usePropertyFormContainerData } from "@/hooks/property-form/usePropertyFormContainerData";
import { usePropertyFormContainerActions } from "@/hooks/property-form/usePropertyFormContainerActions";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyFormLoader } from "@/components/property/form/PropertyFormLoader";
import { useSearchParams } from "react-router-dom";

export function PropertyFormContainer() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const propertyIdFromUrl = searchParams.get("propertyId");
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
    isSubmitting,
    setIsSubmitting,
    toast
  } = usePropertyFormContainerData(propertyIdFromUrl);

  useEffect(() => {
    console.log("PropertyFormContainer - Using property ID:", propertyIdFromUrl || id);
  }, [propertyIdFromUrl, id]);

  const {
    deleteProperty,
    saveProperty,
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

  // Set document title based on property title
  useEffect(() => {
    if (formData?.title) {
      document.title = formData.title;
    } else {
      document.title = "Edit Property";
    }
    
    return () => {
      document.title = "Brochure Generator";
    };
  }, [formData?.title]);

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
      selectedAgent={selectedAgent}
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
