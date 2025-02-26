
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { PropertyFormContent } from "@/components/property/form/PropertyFormContent";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import type { PropertyFormData } from "@/types/property";
import { steps } from "@/components/property/form/formSteps";
import { FormStepNavigation } from "@/components/property/form/FormStepNavigation";
import { useFormSteps } from "@/hooks/useFormSteps";

export function AddPropertyForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handlePropertySubmit = (data: PropertyFormData) => {
    try {
      navigate('/');
      toast({
        title: "Success",
        description: "Property created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
    }
  };

  const { formData, setFormData } = usePropertyForm(undefined, handlePropertySubmit);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { currentStep, handleNext, handlePrevious, handleStepClick } = useFormSteps(formData, () => {}, steps.length);
  
  const {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleFloorplanUpload,
    handleRemoveAreaPhoto,
    handleRemoveFloorplan,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const {
    handleAreaImageUpload,
    addArea,
    removeArea,
    updateArea,
    removeAreaImage
  } = usePropertyAreas(formData, setFormData);

  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
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

  return (
    <div className="container py-10">
      <Card className="w-full p-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          handlePropertySubmit(formData);
        }} className="space-y-6">
          <FormStepNavigation
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            onPrevious={handlePrevious}
            onNext={handleNext}
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
            onAreaImageRemove={removeAreaImage}
            handleImageUpload={handleImageUpload}
            handleAreaPhotosUpload={handleAreaPhotosUpload}
            handleFloorplanUpload={handleFloorplanUpload}
            handleRemoveImage={handleRemoveImageAdapter}
            handleRemoveAreaPhoto={handleRemoveAreaPhoto}
            handleRemoveFloorplan={handleRemoveFloorplan}
            handleSetFeaturedImage={handleSetFeaturedImage}
            handleToggleGridImage={handleToggleGridImageAdapter}
            handleMapImageDelete={handleMapImageDelete}
          />
        </form>
      </Card>
    </div>
  );
}
