
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyAreas } from "@/hooks/usePropertyAreas";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { useFeatures } from "@/hooks/useFeatures";
import { usePropertyAutosave } from "@/hooks/usePropertyAutosave";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormData, PropertyPlaceType } from "@/types/property";
import { steps } from "./property/form/formSteps";
import { useFormSteps } from "@/hooks/useFormSteps";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { PropertyTabs } from "./property/PropertyTabs";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyDashboardTab } from "./property/tabs/PropertyDashboardTab";
import { PropertyContentTab } from "./property/tabs/PropertyContentTab";
import { PropertyMediaTab } from "./property/tabs/PropertyMediaTab";
import { PropertySettingsTab } from "./property/tabs/PropertySettingsTab";
import { useWebViewOpenState } from "@/hooks/useWebViewOpenState";
import { PropertyWebView } from "./property/PropertyWebView";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export function PropertyForm() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { addFeature, removeFeature, updateFeature } = useFeatures(formData, setFormData);
  const { handleSubmit } = usePropertyFormSubmit();
  const { autosaveData } = usePropertyAutosave();
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  const { generatePDF } = useGeneratePDF();
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);
  
  const {
    handleImageUpload,
    handleRemoveImage,
    handleAreaPhotosUpload,
    handleRemoveAreaPhoto,
    handleSetFeaturedImage,
    handleToggleGridImage
  } = usePropertyImages(formData, setFormData);

  const {
    handleFloorplanUpload,
    handleRemoveFloorplan,
    handleUpdateFloorplan
  } = usePropertyFloorplans(formData, setFormData);

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

  const handleRemoveNearbyPlace = (index: number) => {
    if (formData && formData.nearby_places) {
      const updatedPlaces = [...formData.nearby_places];
      updatedPlaces.splice(index, 1);
      setFormData({ ...formData, nearby_places: updatedPlaces });
      toast({
        title: "Place removed",
        description: "The nearby place has been removed.",
      });
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
  
  const handleGeneratePDF = async () => {
    if (!formData) return;
    
    try {
      await generatePDF(formData);
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteProperty = async () => {
    if (!formData?.id) return;
    
    try {
      const { error } = await supabase.from('properties').delete().eq('id', formData.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

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
  console.log("PropertyForm floorplans:", formData.floorplans);
  console.log("PropertyForm areas:", formData.areas);

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <form 
        id="propertyForm" 
        onSubmit={onFormSubmit} 
        className="space-y-6"
      >
        <PropertyTabs activeTab={activeTab} onTabChange={setActiveTab}>
          <TabsContent value="dashboard">
            <PropertyDashboardTab
              id={formData.id || ''}
              objectId={formData.object_id}
              title={formData.title || ''}
              agentId={formData.agent_id}
              agentName={formData.agent?.name}
              createdAt={formData.created_at}
              updatedAt={formData.updated_at}
              onSave={() => onFormSubmit(new Event('submit') as any)}
              onDelete={handleDeleteProperty}
              onGeneratePDF={handleGeneratePDF}
              onWebView={() => setIsWebViewOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="content">
            <PropertyContentTab
              formData={formData}
              currentStep={currentStep}
              handleStepClick={handleStepClick}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              onSubmit={onFormSubmit}
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
              onFetchLocationData={() => Promise.resolve()} // Placeholder for actual implementation
              onRemoveNearbyPlace={handleRemoveNearbyPlace}
              isUpdateMode={!!id}
            />
          </TabsContent>
          
          <TabsContent value="media">
            <PropertyMediaTab
              id={formData.id || ''}
              images={formData.images || []}
              floorplans={formData.floorplans || []}
              virtualTourUrl={formData.virtualTourUrl}
              youtubeUrl={formData.youtubeUrl}
              onImageUpload={handleImageUpload}
              onFloorplanUpload={handleFloorplanUpload}
              onRemoveImage={handleRemoveImageAdapter}
              onRemoveFloorplan={handleRemoveFloorplan}
              onUpdateFloorplan={handleUpdateFloorplan}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <PropertySettingsTab
              id={formData.id || ''}
              objectId={formData.object_id}
              agentId={formData.agent_id}
              selectedTemplateId="default"
              onDelete={handleDeleteProperty}
            />
          </TabsContent>
        </PropertyTabs>
      </form>
      
      <PropertyWebView
        property={formData}
        open={isWebViewOpen}
        onOpenChange={setIsWebViewOpen}
      />
    </Card>
  );
}

