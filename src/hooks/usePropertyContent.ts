
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PropertyFeature, PropertyFormData, PropertyTechnicalItem } from '@/types/property';
import { steps } from '@/components/property/form/formSteps';
import { useToast } from '@/components/ui/use-toast';

export function usePropertyContent(
  formData: PropertyFormData,
  onFieldChange: (field: keyof PropertyFormData, value: any) => void,
  handleFloorplanUpload?: (file: File) => Promise<{id: string, url: string, filePath?: string}>
) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleStepClick = (stepId: number) => {
    console.log(`usePropertyContent - Setting current step to ${stepId}`);
    setCurrentStep(stepId);
  };

  const handleNext = () => {
    console.log(`usePropertyContent - Current step: ${currentStep}, max steps: ${steps.length}`);
    if (currentStep < steps.length) {
      console.log(`usePropertyContent - Moving to next step: ${currentStep + 1}`);
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      console.log('usePropertyContent - Already at the last step');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      console.log(`usePropertyContent - Moving to previous step: ${currentStep - 1}`);
      setCurrentStep(prevStep => prevStep - 1);
    } else {
      console.log('usePropertyContent - Already at the first step');
    }
  };

  const onSubmit = () => {
    console.log('usePropertyContent - Form submitted');
    toast({
      title: "Form submitted",
      description: "Your changes have been saved."
    });
  };

  // Feature management functions
  const addFeature = useCallback(() => {
    console.log("usePropertyContent - Adding new feature");
    const newFeature: PropertyFeature = {
      id: uuidv4(),
      description: ''
    };
    
    // Make sure to clone the existing features array or create a new one if it doesn't exist
    const updatedFeatures = [...(formData.features || []), newFeature];
    console.log("usePropertyContent - Updated features:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  const removeFeature = useCallback((id: string) => {
    console.log("usePropertyContent - Removing feature with ID:", id);
    const updatedFeatures = (formData.features || []).filter(feature => feature.id !== id);
    console.log("usePropertyContent - Updated features after removal:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  const updateFeature = useCallback((id: string, description: string) => {
    console.log("usePropertyContent - Updating feature with ID:", id, "New description:", description);
    const updatedFeatures = (formData.features || []).map(feature => 
      feature.id === id ? { ...feature, description } : feature
    );
    console.log("usePropertyContent - Updated features after update:", updatedFeatures);
    onFieldChange('features', updatedFeatures);
  }, [formData, onFieldChange]);

  // Technical item management functions
  const addTechnicalItem = useCallback((e?: React.MouseEvent) => {
    // Prevent default behavior to avoid form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("usePropertyContent - Adding new technical item");
    
    const newItem: PropertyTechnicalItem = {
      id: uuidv4(),
      title: '',
      size: '',
      description: '',
      floorplanId: null
    };
    
    const currentItems = formData.technicalItems || [];
    onFieldChange('technicalItems', [...currentItems, newItem]);
  }, [formData, onFieldChange]);

  const removeTechnicalItem = useCallback((id: string) => {
    const currentItems = formData.technicalItems || [];
    const updatedItems = currentItems.filter(item => item.id !== id);
    onFieldChange('technicalItems', updatedItems);
  }, [formData, onFieldChange]);

  const updateTechnicalItem = useCallback((id: string, field: keyof PropertyTechnicalItem, value: any) => {
    const currentItems = formData.technicalItems || [];
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onFieldChange('technicalItems', updatedItems);
  }, [formData, onFieldChange]);

  // Handle floorplan upload for technical items
  const handleTechnicalItemFloorplanUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, technicalItemId: string) => {
    if (!handleFloorplanUpload || !e.target.files || e.target.files.length === 0) return;
    
    try {
      const file = e.target.files[0];
      const result = await handleFloorplanUpload(file);
      
      // If we have a result with ID and URL
      if (result?.id && result?.url) {
        // Add the floorplan to the floorplans array if it doesn't exist yet
        const existingFloorplans = [...(formData.floorplans || [])];
        const floorplanExists = existingFloorplans.some(f => f.id === result.id);
        
        if (!floorplanExists) {
          // Add the new floorplan
          onFieldChange('floorplans', [...existingFloorplans, result]);
        }
        
        // Update the technical item to reference this floorplan
        updateTechnicalItem(technicalItemId, 'floorplanId', result.id);
        
        toast({
          title: "Success",
          description: "Floorplan image uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading floorplan for technical item:", error);
      toast({
        title: "Error",
        description: "Failed to upload floorplan image.",
        variant: "destructive",
      });
    }
  }, [formData, onFieldChange, updateTechnicalItem, handleFloorplanUpload, toast]);

  return {
    currentStep,
    handleStepClick,
    handleNext,
    handlePrevious,
    onSubmit,
    handleFieldChange: onFieldChange,
    // Feature management
    addFeature,
    removeFeature,
    updateFeature,
    // Technical item management
    addTechnicalItem,
    removeTechnicalItem,
    updateTechnicalItem,
    handleTechnicalItemFloorplanUpload
  };
}
