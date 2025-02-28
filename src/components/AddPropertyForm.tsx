
import { Card } from "@/components/ui/card";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyAutosave } from "@/hooks/usePropertyAutosave";
import type { PropertyFormData } from "@/types/property";
import { steps } from "./property/form/formSteps";
import { FormStepNavigation } from "./property/form/FormStepNavigation";
import { useFormSteps } from "@/hooks/useFormSteps";
import { PropertyFormContent } from "./property/form/PropertyFormContent";
import { useState, useCallback } from "react";

export function AddPropertyForm() {
  const { formData, setFormData, isLoading } = usePropertyForm(undefined);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { handleSubmit } = usePropertyFormSubmit();
  const { autosaveData } = usePropertyAutosave();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const {
    handleAreaImageUpload,
    addArea,
    removeArea,
    updateArea,
    handleAreaImageRemove,
    handleAreaImagesSelect
  } = usePropertyAreas(formData, setFormData);

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    () => autosaveData(formData),
    steps.length
  );

  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMapImageDelete = async () => {
    setFormData({ ...formData, map_image: null });
  };

  // Create adapter functions to match expected types
  const handleRemoveImageAdapter = (index: number) => {
    if (!formData || !formData.images[index]) return;
    handleRemoveImage(index);
  };

  const onFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !formData) return;
    
    setIsSubmitting(true);
    try {
      handleSubmit(e, formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, handleSubmit, isSubmitting]);

  if (isLoading) {
    return null;
  }

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <form 
        id="propertyForm" 
        onSubmit={onFormSubmit} 
        className="space-y-6"
      >
        <FormStepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={() => onFormSubmit(new Event('submit') as any)}
          isUpdateMode={false}
        />
        <PropertyFormContent 
          step={currentStep}
          formData={formData}
          onFieldChange={handleFieldChange}
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
          handleAreaPhotosUpload={handleAreaPhotosUpload}
          handleFloorplanUpload={handleFloorplanUpload}
          handleRemoveImage={handleRemoveImageAdapter}
          handleRemoveAreaPhoto={handleRemoveAreaPhoto}
          handleRemoveFloorplan={handleRemoveFloorplan}
          handleUpdateFloorplan={handleUpdateFloorplan}
          handleSetFeaturedImage={handleSetFeaturedImage}
          handleToggleGridImage={handleToggleGridImage}
          handleMapImageDelete={handleMapImageDelete}
        />
      </form>
    </Card>
  );
}
