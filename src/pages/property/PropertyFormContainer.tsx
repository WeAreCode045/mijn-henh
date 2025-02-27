
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyFormSubmit } from "@/hooks/usePropertyFormSubmit";
import { usePropertyAreaPhotos } from "@/hooks/images/usePropertyAreaPhotos";
import { usePropertyFloorplans } from "@/hooks/images/usePropertyFloorplans";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormLayout } from "./PropertyFormLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAgentSelect } from "@/hooks/useAgentSelect";

export function PropertyFormContainer() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { settings } = useAgencySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load property data
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { agents, selectedAgent, setSelectedAgent } = useAgentSelect(formData?.agent_id);
  const { handleSubmit } = usePropertyFormSubmit();

  // Load property image handlers
  const {
    handleImageUpload,
    handleRemoveImage,
    images,
  } = usePropertyImages(formData, setFormData);

  const deleteProperty = async () => {
    if (!id || !formData) return;
    
    // Here we could implement the actual delete logic
    try {
      // Navigate back to properties list after deletion
      navigate('/properties');
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const saveProperty = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    try {
      await handleSubmit({} as React.FormEvent, formData);
      toast({
        title: "Success",
        description: "Property saved successfully",
      });
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PropertyFormLayout
      title={id ? "Edit Property" : "Add New Property"}
      propertyData={formData || { id: "" } as any}
      settings={settings}
      isAdmin={isAdmin}
      agents={agents}
      selectedAgent={selectedAgent}
      onAgentSelect={setSelectedAgent}
      onDeleteProperty={deleteProperty}
      onSaveProperty={saveProperty}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      images={images.map(img => img.url)} // Convert PropertyImage[] to string[] by extracting the URL
    >
      <PropertyForm />
    </PropertyFormLayout>
  );
}
