
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyAutosave } from "@/hooks/usePropertyAutosave";
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFormData } from "@/types/property";
import { steps } from "./property/form/formSteps";
import { FormStepNavigation } from "./property/form/FormStepNavigation";
import { useFormSteps } from "@/hooks/useFormSteps";
import { PropertyFormContent } from "./property/form/PropertyFormContent";

export function PropertyForm() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { handleSubmit } = usePropertyFormSubmit();
  const { autosaveData } = usePropertyAutosave();
  
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
    removeAreaImage,
    handleAreaImagesSelect
  } = usePropertyAreas(formData, setFormData);

  // Perform autosave when changing steps
  const onAutosave = useCallback(() => {
    console.log("Autosaving form data...");
    if (formData) autosaveData(formData);
  }, [formData, autosaveData]);

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    onAutosave,
    steps.length
  );

  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    console.log(`Field ${field} changed to:`, value);
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleMapImageDelete = async () => {
    if (formData) {
      setFormData({ ...formData, map_image: null });
    }
  };

  // Create adapter functions to match expected types
  const handleRemoveImageAdapter = (index: number) => {
    if (!formData || !formData.images[index]) return;
    handleRemoveImage(index);
  };

  const onFormSubmit = useCallback((e: React.FormEvent) => {
    console.log("PropertyForm - Form submitted via standard submit event");
    e.preventDefault();
    
    if (isSubmitting || !formData) return;
    
    setIsSubmitting(true);
    try {
      handleSubmit(e, formData);
      toast({
        title: "Form submitted",
        description: "Your property information has been saved.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission error",
        description: "There was a problem saving your property information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, handleSubmit, isSubmitting, toast]);

  if (isLoading) {
    return (
      <Card className="w-full p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </Card>
    );
  }

  if (!formData) {
    return (
      <Card className="w-full p-6">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-500">Error loading property data. Please try again later.</p>
        </div>
      </Card>
    );
  }

  console.log("PropertyForm rendering, currentStep:", currentStep);

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
          isUpdateMode={!!id}
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
          onAreaImageRemove={removeAreaImage}
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
