
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
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

export function PropertyForm() {
  const { id } = useParams();
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

  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(
    formData,
    () => {
      console.log("Autosaving form data...");
      if (formData) autosaveData(formData);
    },
    steps.length
  );

  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    console.log(`Field ${field} changed to:`, value);
    setFormData({ ...formData, [field]: value });
  };

  const handleMapImageDelete = async () => {
    setFormData({ ...formData, map_image: null });
  };

  // Create adapter functions to match expected types
  const handleRemoveImageAdapter = (index: number) => {
    const imageToRemove = formData.images[index];
    if (imageToRemove) {
      handleRemoveImage(imageToRemove.id);
    }
  };

  const handleToggleGridImageAdapter = (url: string) => {
    const newGridImages = [...(formData.gridImages || [])];
    if (newGridImages.includes(url)) {
      newGridImages.splice(newGridImages.indexOf(url), 1);
    } else {
      newGridImages.push(url);
    }
    handleToggleGridImage(newGridImages);
  };

  if (!formData || isLoading) {
    return null;
  }

  const onFormSubmit = (e: React.FormEvent) => {
    console.log("PropertyForm - Form submitted via standard submit event");
    handleSubmit(e, formData);
  };

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
          handleToggleGridImage={handleToggleGridImageAdapter}
          handleMapImageDelete={handleMapImageDelete}
        />
      </form>
    </Card>
  );
}
