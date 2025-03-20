
import { useState } from 'react';
import { PropertyFormData } from '@/types/property';
import { usePropertyFormState } from '@/hooks/usePropertyFormState';
import { usePropertyFeatures } from './property-form/usePropertyFeatures';
import { usePropertyAreas } from './property-form/usePropertyAreas';
import { usePropertyContent } from './property-form/usePropertyContent';
import { usePropertyImages } from './property-form/usePropertyImages';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyFormManager(property: PropertyFormData) {
  const [formState, setFormState] = useState<PropertyFormData>(property);
  const { toast } = useToast();
  
  // Hook for handling form state
  const { 
    onFieldChange 
  } = usePropertyFormState(formState, setFormState);
  
  // Hook for managing features
  const { 
    addFeature, 
    removeFeature, 
    updateFeature 
  } = usePropertyFeatures(formState, onFieldChange);
  
  // Hook for managing areas
  const { 
    addArea, 
    removeArea, 
    updateArea, 
    handleAreaImageRemove, 
    handleAreaImagesSelect,
    handleAreaImageUpload,
    isUploading
  } = usePropertyAreas(formState, onFieldChange);
  
  // Hook for managing content and steps
  const { 
    fetchLocationData,
    fetchCategoryPlaces,
    fetchNearbyCities,
    generateLocationDescription,
    generateMapImage,
    removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    lastSaved,
    isSaving,
    setPendingChanges,
    onSubmit
  } = usePropertyContent(formState, onFieldChange);
  
  // Hook for managing images
  const {
    handleImageUpload,
    handleRemoveImage,
    images
  } = usePropertyImages(formState, onFieldChange);

  // Implementation for the save object ID function that returns a Promise
  const handleSaveObjectId = async (objectId: string): Promise<void> => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      onFieldChange('object_id', objectId);
      
      const { error } = await supabase
        .from('properties')
        .update({ object_id: objectId })
        .eq('id', formState.id);
      
      if (error) throw error;
      
      toast({
        description: "Object ID saved successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving object ID:', error);
      toast({
        title: "Error",
        description: "Failed to save object ID",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Implementation for the save agent function that returns a Promise
  const handleSaveAgent = async (agentId: string): Promise<void> => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      // Update local state
      onFieldChange('agent_id', agentId === "" ? null : agentId);
      
      // Save to database
      const { error } = await supabase
        .from('properties')
        .update({ agent_id: agentId === "" ? null : agentId })
        .eq('id', formState.id);
      
      if (error) throw error;
      
      toast({
        description: "Agent assigned successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Implementation for the save template function that returns a Promise
  const handleSaveTemplate = async (templateId: string): Promise<void> => {
    if (!formState.id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.reject(new Error("Property ID is missing"));
    }
    
    try {
      // Update local state
      onFieldChange('template_id', templateId);
      
      // Save to database
      const { error } = await supabase
        .from('properties')
        .update({ template_id: templateId })
        .eq('id', formState.id);
      
      if (error) throw error;
      
      toast({
        description: "Template assigned successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to assign template",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };
  
  return {
    formState,
    handleFieldChange: onFieldChange,
    
    // Feature methods
    onAddFeature: addFeature,
    onRemoveFeature: removeFeature,
    onUpdateFeature: updateFeature,
    
    // Area methods
    onAddArea: addArea,
    onRemoveArea: removeArea,
    onUpdateArea: updateArea,
    onAreaImageRemove: handleAreaImageRemove,
    onAreaImagesSelect: handleAreaImagesSelect,
    handleAreaImageUpload,
    
    // Location methods
    onFetchLocationData: fetchLocationData,
    onFetchCategoryPlaces: fetchCategoryPlaces,
    onFetchNearbyCities: fetchNearbyCities,
    onGenerateLocationDescription: generateLocationDescription,
    onGenerateMap: generateMapImage,
    onRemoveNearbyPlace: removeNearbyPlace,
    isLoadingLocationData,
    isGeneratingMap,
    
    // Step navigation
    onSubmit,
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    
    // Status
    lastSaved,
    isSaving,
    setPendingChanges,
    
    // Image methods
    handleImageUpload,
    handleRemoveImage,
    images,
    isUploading,
    
    // Methods that now return Promises
    handleSaveObjectId,
    handleSaveAgent,
    handleSaveTemplate
  };
}
