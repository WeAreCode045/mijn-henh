
import React, { useState, useEffect } from "react";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormLayout } from "@/pages/property/PropertyFormLayout";
import { usePropertyFormContainerData } from "@/hooks/property-form/usePropertyFormContainerData";
import { usePropertyFormContainerActions } from "@/hooks/property-form/usePropertyFormContainerActions";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyFormLoader } from "@/components/property/form/PropertyFormLoader";
import { useSearchParams, useParams } from "react-router-dom";
import { PropertyData } from "@/types/property";

interface PropertyFormContainerProps {
  propertyId?: string;
  initialTab?: string;
  initialContentStep?: number;
}

export function PropertyFormContainer({ 
  propertyId: propPropertyId, 
  initialTab, 
  initialContentStep
}: PropertyFormContainerProps) {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const { id: paramsId } = useParams();
  // Use propertyId from props, searchParams, or URL params in that order
  const propertyId = propPropertyId || searchParams.get("propertyId") || paramsId;
  const [agentInfo, setAgentInfo] = useState<{id: string, name: string} | null>(null);
  
  // Log to help with debugging
  console.log("PropertyFormContainer - Using property ID:", propertyId);
  console.log("PropertyFormContainer - Initial tab:", initialTab);
  console.log("PropertyFormContainer - Initial content step:", initialContentStep);
  
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

  // Additional debug logging
  useEffect(() => {
    console.log("PropertyFormContainer - formData loaded:", formData !== undefined && formData !== null);
    if (formData) {
      console.log("PropertyFormContainer - formData ID:", formData.id);
      console.log("PropertyFormContainer - formData title:", formData.title);
      console.log("PropertyFormContainer - formData agent_id:", formData.agent_id);
    }
  }, [formData]);

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
    location_description: formData.location_description || '',
    features: formData.features || [],
    areas: formData.areas || [],
    nearby_places: formData.nearby_places || [],
    nearby_cities: formData.nearby_cities || [],
    images: formData.images || [],
    floorplans: formData.floorplans || [],
    map_image: formData.map_image || null,
    latitude: formData.latitude || null,
    longitude: formData.longitude || null,
    object_id: formData.object_id || '',
    agent_id: formData.agent_id || '',
    template_id: formData.template_id || 'default',
    virtualTourUrl: formData.virtualTourUrl || '',
    youtubeUrl: formData.youtubeUrl || '',
    floorplanEmbedScript: formData.floorplanEmbedScript || '',
    created_at: formData.created_at,
    updated_at: formData.updated_at,
    status: formData.status || 'Draft',
    featuredImage: formData.featuredImage || null,
    featuredImages: formData.featuredImages || []
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
      <PropertyForm 
        initialTab={initialTab}
        initialContentStep={initialContentStep}
        formData={formData}
      />
    </PropertyFormLayout>
  );
}
