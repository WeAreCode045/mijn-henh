
import React, { useState, useEffect } from "react";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { usePropertyFormContainerData } from "@/hooks/property-form/usePropertyFormContainerData";
import { usePropertyFormContainerActions } from "@/hooks/property-form/usePropertyFormContainerActions";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyFormLoader } from "@/components/property/form/PropertyFormLoader";
import { useSearchParams, useParams } from "react-router-dom";
import { PropertyData } from "@/types/property";

interface PropertyFormContainerProps {
  propertyId?: string;
}

export function PropertyFormContainer({ propertyId: propPropertyId }: PropertyFormContainerProps) {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const { id: paramsId } = useParams();
  // Use propertyId from props, searchParams, or URL params in that order
  const propertyId = propPropertyId || searchParams.get("propertyId") || paramsId;
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);
  
  // Log to help with debugging
  console.log("PropertyFormContainer - Using property ID:", propertyId);
  
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
  } = usePropertyFormContainerData(propertyId);

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
      console.log("PropertyFormContainer - Property loaded:", {
        id: formData.id,
        title: formData.title
      });
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

  // Create a complete PropertyData object from formData to avoid TypeScript errors
  const propertyData: PropertyData = {
    id: formData.id || '',
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    sqft: formData.sqft || '',
    livingArea: formData.livingArea || '',
    buildYear: formData.buildYear || '',
    garages: formData.garages || '',
    energyLabel: formData.energyLabel || '',
    hasGarden: formData.hasGarden || false,
    description: formData.description || '',
    features: formData.features || [],
    images: formData.images || [],
    areas: formData.areas || []
  };

  return (
    <PropertyFormLayout
      title={formData.title || "Edit Property"}
      propertyData={propertyData}
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
