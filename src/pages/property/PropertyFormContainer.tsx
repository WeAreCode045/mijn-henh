
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAuth } from "@/providers/AuthProvider";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { usePropertySubmit } from "@/hooks/usePropertySubmit";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { supabase } from "@/integrations/supabase/client";

// Import our new components
import { PropertyFormHeader } from "./components/PropertyFormHeader";
import { PropertyActionsPanel } from "./components/PropertyActionsPanel";
import { createAgencySettingsFromSettings } from "./components/PropertySettingsAdapter";
import { 
  createPropertyDataFromFormData, 
  createSubmitDataFromPropertyData 
} from "./components/PropertyDataAdapter";

export function PropertyFormContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  const { isAdmin } = useAuth();
  const { handleDatabaseSubmit } = usePropertySubmit();

  const handleFormSubmit = (formData: any) => {
    console.log("PropertyFormContainer - handleFormSubmit called with formData:", formData);
    if (!formData.id) {
      console.error('Property ID is required');
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return;
    }

    // Create a propertyData object with the required id
    const propertyData = createPropertyDataFromFormData(formData);

    // Log the areas data for debugging
    console.log("Areas data before submission:", JSON.stringify(prepareAreasForSubmission(propertyData)));
    console.log("Floorplans data before submission:", JSON.stringify(prepareFloorplansForSubmission(propertyData)));

    const submitData = createSubmitDataFromPropertyData(propertyData, selectedAgent);
    
    console.log("Submitting property with data:", JSON.stringify(submitData));
    handleDatabaseSubmit(submitData, formData.id);
  };

  const { formData, setFormData, isLoading } = usePropertyForm(id, handleFormSubmit);
  const {
    handleImageUpload,
    handleRemoveImage,
  } = usePropertyImages(formData, setFormData);

  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);

  const handleDeleteProperty = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted",
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete the property",
        variant: "destructive",
      });
    }
  };

  const handleSaveProperty = () => {
    console.log("Save button clicked in PropertyFormContainer, submitting current formData");
    if (formData && formData.id) {
      handleFormSubmit(formData);
    } else {
      console.error("Cannot save: formData is missing or incomplete");
      toast({
        title: "Error",
        description: "Cannot save: form data is missing or incomplete",
        variant: "destructive",
      });
    }
  };

  if (!formData || isLoading) {
    return null;
  }

  // Create data objects needed by child components
  const propertyDataWithId = createPropertyDataFromFormData(formData);
  const agencySettings = createAgencySettingsFromSettings(settings);
  
  return (
    <PropertyFormLayout
      title={id ? "Edit Property" : "New Property"}
      propertyData={propertyDataWithId}
      settings={settings}
      isAdmin={isAdmin}
      agents={agents}
      selectedAgent={selectedAgent}
      onAgentSelect={setSelectedAgent}
      onDeleteProperty={handleDeleteProperty}
      onSaveProperty={handleSaveProperty}
      onImageUpload={handleImageUpload}
      onRemoveImage={(index) => {
        const imageToRemove = propertyDataWithId.images[index];
        if (imageToRemove) {
          handleRemoveImage(imageToRemove.id);
        }
      }}
      images={propertyDataWithId.images.map(img => img.url)}
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
