
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
// Import the missing functions
import { prepareAreasForFormSubmission, prepareFloorplansForFormSubmission } from "@/hooks/property-form/preparePropertyData";

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

    // Log the areas data for debugging - use the correctly imported functions
    console.log("Areas data before submission:", JSON.stringify(prepareAreasForFormSubmission(propertyData.areas)));
    console.log("Floorplans data before submission:", JSON.stringify(prepareFloorplansForFormSubmission(propertyData.floorplans)));

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

  // Show a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estate-800"></div>
      </div>
    );
  }

  // Make sure we have formData before rendering the form
  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg font-semibold">
          Unable to load property data
        </div>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-estate-700 text-white rounded hover:bg-estate-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Create data objects needed by child components
  const propertyDataWithId = createPropertyDataFromFormData(formData);
  
  // Create adapter functions to match expected types
  const handleRemoveImageAdapter = (index: number) => {
    const imageToRemove = propertyDataWithId.images[index];
    if (imageToRemove) {
      handleRemoveImage(index);
    }
  };
  
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
      onRemoveImage={handleRemoveImageAdapter}
      images={propertyDataWithId.images.map(img => img.url)}
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
