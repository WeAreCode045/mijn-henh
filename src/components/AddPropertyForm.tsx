import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFeature } from "@/types/property";
import { PropertyFeaturesList } from "./property/PropertyFeaturesList";
import { PropertyImageUpload } from "./property/PropertyImageUpload";
import { PropertyImageGallery } from "./property/PropertyImageGallery";
import { PropertyAreasList } from "./property/PropertyAreasList";
import { PropertyArea } from "@/types/property";
import { PropertyLocationForm } from "./property/PropertyLocationForm";
import { PropertyNearbyPlacesList } from "./property/PropertyNearbyPlacesList";
import { PropertyNearbyPlace } from "@/types/property";
import { PropertyFloorplanUpload } from "./property/PropertyFloorplanUpload";
import { PropertyFloorplanGallery } from "./property/PropertyFloorplanGallery";
import { PropertyAgentSelect } from "./property/PropertyAgentSelect";
import { PropertyTemplateSelect } from "./property/PropertyTemplateSelect";
import { PropertyFormStepper } from "./property/PropertyFormStepper";
import { PropertyFormStepButtons } from "./property/PropertyFormStepButtons";
import { PropertyFormStep } from "./property/PropertyFormStep";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { usePropertyAreaPhotos } from "@/hooks/images/usePropertyAreaPhotos";
import { usePropertyMainImages } from "@/hooks/images/usePropertyMainImages";
import { usePropertyFormState } from "@/hooks/usePropertyFormState";
import { usePropertyContent } from "@/hooks/usePropertyContent";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyLocation } from "@/hooks/usePropertyLocation";
import { usePropertyStepNavigation } from "@/hooks/usePropertyStepNavigation";
import { usePropertyAutoSave } from "@/hooks/usePropertyAutoSave";
import { usePropertyStateTracking } from "@/hooks/usePropertyStateTracking";
import { usePropertyFormActions } from "@/hooks/usePropertyFormActions";
import { steps } from "./property/form/formSteps";

// Helper function to safely convert values to string
const safeToString = (value: any): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

export function AddPropertyForm({ property, onSave, onDelete }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedAgent, setSelectedAgent] = useState(property?.agent_id || null);
  const [selectedTemplate, setSelectedTemplate] = useState(property?.template_id || "default");
  const [agents, setAgents] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Form state management
  const { formState, setFormState, handleFieldChange } = usePropertyFormState(property || {});
  
  // Auto-save functionality
  const { 
    autosaveData, 
    isSaving, 
    lastSaved, 
    pendingChanges, 
    setPendingChanges, 
    setLastSaved 
  } = usePropertyAutoSave();
  
  // State tracking utilities
  const { handleFieldChangeWithTracking, setFormStateWithTracking } = 
    usePropertyStateTracking(
      formState, 
      handleFieldChange, 
      setFormState,
      setPendingChanges
    );
  
  // Property content management
  const {
    addFeature,
    removeFeature,
    updateFeature,
  } = usePropertyContent(
    formState,
    handleFieldChangeWithTracking
  );
  
  // Property areas management
  const {
    addArea,
    removeArea,
    updateArea,
    handleAreaImageUpload,
    handleAreaImageRemove,
    handleAreaImagesSelect,
  } = usePropertyAreas(
    formState, 
    setFormStateWithTracking
  );
  
  // Property images management
  const {
    handleImageUpload,
    handleRemoveImage,
    isUploading,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    images
  } = usePropertyImages(
    formState, 
    setFormStateWithTracking
  );

  // Property floorplans management
  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    isUploadingFloorplan
  } = usePropertyFloorplans(
    formState,
    setFormStateWithTracking
  );
  
  // Property location management
  const {
    handleFetchLocationData,
    handleRemoveNearbyPlace,
    isLoadingLocationData
  } = usePropertyLocation(
    formState,
    setFormStateWithTracking
  );
  
  // Step navigation with auto-save
  const { currentStep, handleStepClick, handleNext, handlePrevious } = 
    usePropertyStepNavigation(formState, pendingChanges, setPendingChanges, setLastSaved);
  
  // Form submission and other actions
  const { handleSaveObjectId, handleSaveAgent, handleSaveTemplate, onSubmit } = 
    usePropertyFormActions(formState, setPendingChanges, setLastSaved);

  // Fetch agents and templates on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'agent');
        
      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }
      
      setAgents(data || []);
    };
    
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('brochure_templates')
        .select('id, name');
        
      if (error) {
        console.error('Error fetching templates:', error);
        return;
      }
      
      // Add default template
      const templatesWithDefault = [
        { id: 'default', name: 'Default Template' },
        ...(data || [])
      ];
      
      setTemplates(templatesWithDefault);
    };
    
    fetchAgents();
    fetchTemplates();
  }, []);
  
  // Update selected agent and template when property changes
  useEffect(() => {
    if (property) {
      setSelectedAgent(property.agent_id || null);
      setSelectedTemplate(property.template_id || 'default');
    }
  }, [property]);
  
  // Handle agent selection
  const handleAgentSelect = (agentId) => {
    setSelectedAgent(agentId);
    handleSaveAgent(agentId);
  };
  
  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    handleSaveTemplate(templateId);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit();
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
      
      if (!property?.id) {
        navigate('/properties');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle property deletion
  const handleDelete = async () => {
    if (!property?.id) return;
    
    try {
      await onDelete();
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      navigate('/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };
  
  // Render the current step
  const renderStep = () => {
    const StepComponent = steps[currentStep - 1]?.component;
    
    if (!StepComponent) {
      return <div>Invalid step</div>;
    }
    
    return (
      <StepComponent
        formData={formState}
        onFieldChange={handleFieldChangeWithTracking}
        onAddFeature={addFeature}
        onRemoveFeature={removeFeature}
        onUpdateFeature={updateFeature}
        onAddArea={addArea}
        onRemoveArea={removeArea}
        onUpdateArea={updateArea}
        onAreaImageUpload={handleAreaImageUpload}
        onAreaImageRemove={handleAreaImageRemove}
        onAreaImagesSelect={handleAreaImagesSelect}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
        isUploading={isUploading}
        handleAreaPhotosUpload={handleAreaPhotosUpload}
        handleRemoveAreaPhoto={handleRemoveAreaPhoto}
        handleFloorplanUpload={handleFloorplanUpload}
        handleRemoveFloorplan={handleRemoveFloorplan}
        isUploadingFloorplan={isUploadingFloorplan}
        onFetchLocationData={handleFetchLocationData}
        onRemoveNearbyPlace={handleRemoveNearbyPlace}
        isLoadingLocationData={isLoadingLocationData}
        handleSetFeaturedImage={handleSetFeaturedImage}
        handleToggleFeaturedImage={handleToggleFeaturedImage}
      />
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{property?.id ? 'Edit Property' : 'Add New Property'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <PropertyAgentSelect
                  agents={agents}
                  selectedAgent={selectedAgent}
                  onAgentSelect={handleAgentSelect}
                />
                
                <PropertyTemplateSelect
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                />
              </div>
              
              {property?.id && (
                <div className="text-sm text-gray-500">
                  ID: {safeToString(property.id)}
                </div>
              )}
            </div>
            
            <PropertyFormStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
            
            <div className="mt-6">
              {renderStep()}
            </div>
            
            <PropertyFormStepButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSaving={isSaving}
              lastSaved={lastSaved}
            />
            
            {property?.id && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Delete Property
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
