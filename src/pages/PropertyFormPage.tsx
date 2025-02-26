
import { useNavigate, useParams } from "react-router-dom";
import { PropertyForm } from "@/components/PropertyForm";
import { useToast } from "@/components/ui/use-toast";
import type { PropertySubmitData, PropertyFormData, PropertyData } from "@/types/property";
import { Json } from "@/integrations/supabase/types";
import { PropertyMediaLibrary } from "@/components/property/PropertyMediaLibrary";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { useAuth } from "@/providers/AuthProvider";
import { PropertyActions } from "@/components/property/PropertyActions";
import { PropertyInformationCard } from "@/components/property/PropertyInformationCard";
import { AgentSelector } from "@/components/property/AgentSelector";
import { useAgentSelect } from "@/hooks/useAgentSelect";
import { usePropertySubmit } from "@/hooks/usePropertySubmit";
import { supabase } from "@/integrations/supabase/client";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { settings } = useAgencySettings();
  const { isAdmin } = useAuth();
  const { handleDatabaseSubmit } = usePropertySubmit();

  const handleFormSubmit = (formData: PropertyFormData) => {
    if (!formData.id) {
      console.error('Property ID is required');
      return;
    }

    // Create a propertyData object with the required id
    const propertyData: PropertyData = {
      ...formData,
      id: formData.id,
      features: formData.features || [],
      images: formData.images || [],
      floorplans: formData.floorplans || [],
      areas: formData.areas || [],
      title: formData.title || '',
      price: formData.price || '',
      address: formData.address || '',
      bedrooms: formData.bedrooms || '',
      bathrooms: formData.bathrooms || '',
      sqft: formData.sqft || '',
      livingArea: formData.livingArea || '',
      buildYear: formData.buildYear || '',
      garages: formData.garages || '',
      energyLabel: formData.energyLabel || '',
      hasGarden: formData.hasGarden || false,
      description: formData.description || '',
      featuredImage: formData.featuredImage || null,
      gridImages: formData.gridImages || []
    };

    const submitData: PropertySubmitData = {
      id: propertyData.id,
      title: propertyData.title,
      price: propertyData.price,
      address: propertyData.address,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      sqft: propertyData.sqft,
      livingArea: propertyData.livingArea,
      buildYear: propertyData.buildYear,
      garages: propertyData.garages,
      energyLabel: propertyData.energyLabel,
      hasGarden: propertyData.hasGarden,
      description: propertyData.description,
      location_description: propertyData.location_description,
      floorplans: propertyData.floorplans,
      featuredImage: propertyData.featuredImage,
      gridImages: propertyData.gridImages,
      areaPhotos: propertyData.areaPhotos,
      features: propertyData.features as unknown as Json,
      areas: propertyData.areas as unknown as Json[],
      nearby_places: propertyData.nearby_places as unknown as Json,
      images: propertyData.images.map(img => img.url),
      latitude: propertyData.latitude,
      longitude: propertyData.longitude,
      object_id: propertyData.object_id,
      map_image: propertyData.map_image,
      agent_id: selectedAgent || null
    };
    
    handleDatabaseSubmit(submitData, id);
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

  if (!formData) {
    return null;
  }

  // Cast formData to PropertyData when we know id exists
  const propertyDataWithId: PropertyData = {
    ...formData,
    id: formData.id || crypto.randomUUID(),
    features: formData.features || [],
    images: formData.images || [],
    floorplans: formData.floorplans || [],
    areas: formData.areas || [],
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    sqft: formData.sqft || '',
    livingArea: formData.livingArea || '',
    buildYear: formData.buildYear || '',
    garages: formData.garages || '',
    energyLabel: formData.energyLabel || '',
    hasGarden: formData.hasGarden || false,
    description: formData.description || '',
    featuredImage: formData.featuredImage || null,
    gridImages: formData.gridImages || []
  };

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-estate-800">
            {id ? "Edit Property" : "New Property"}
          </h1>
        </div>

        {propertyDataWithId.id && (
          <PropertyInformationCard
            id={propertyDataWithId.id}
            objectId={propertyDataWithId.object_id}
          />
        )}

        <div className="flex gap-6">
          <PropertyForm onSubmit={handleFormSubmit} />
          <div className="w-80 shrink-0 space-y-6">
            {id && (
              <PropertyActions
                property={propertyDataWithId}
                settings={settings}
                onDelete={handleDeleteProperty}
                onSave={() => handleFormSubmit(formData)}
              />
            )}
            {isAdmin && (
              <AgentSelector
                agents={agents}
                selectedAgent={selectedAgent}
                onAgentSelect={setSelectedAgent}
              />
            )}
            <PropertyMediaLibrary
              images={propertyDataWithId.images.map(img => img.url)}
              onImageUpload={handleImageUpload}
              onRemoveImage={(index) => {
                const imageToRemove = propertyDataWithId.images[index];
                if (imageToRemove) {
                  handleRemoveImage(imageToRemove.id);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
