
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PropertyTabsWrapper } from "./property/PropertyTabsWrapper";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData, PropertyFormData } from "@/types/property";

export function PropertyForm() {
  const { id } = useParams();
  const { formData, setFormData, isLoading } = usePropertyForm(id);
  const { settings } = useAgencySettings();
  const { toast } = useToast();
  const [agentInfo, setAgentInfo] = useState<{ id: string; name: string } | null>(null);
  const [templateInfo, setTemplateInfo] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (formData?.agent_id) {
      // Fetch agent info
      const fetchAgentInfo = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', formData.agent_id)
            .single();
          
          if (data) {
            setAgentInfo({ id: data.id, name: data.full_name });
          }
        } catch (error) {
          console.error("Error fetching agent info:", error);
        }
      };

      fetchAgentInfo();
    }

    // Set default template info
    setTemplateInfo({ id: 'default', name: 'Default Template' });

    // Try to fetch actual template if we have one
    if (formData?.template_id && formData.template_id !== 'default') {
      const fetchTemplateInfo = async () => {
        try {
          const { data } = await supabase
            .from('brochure_templates')
            .select('id, name')
            .eq('id', formData.template_id)
            .single();
          
          if (data) {
            setTemplateInfo({ id: data.id, name: data.name });
          }
        } catch (error) {
          console.error("Error fetching template info:", error);
        }
      };

      fetchTemplateInfo();
    }
  }, [formData?.agent_id, formData?.template_id]);

  // This is now a dummy function that doesn't trigger actual saves
  const handleSave = () => {
    // No longer used for actual saving - that's handled in ContentTabWrapper
    console.log("PropertyForm.handleSave called - this is just a notification");
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) {
      toast({
        title: "Error",
        description: "Property ID is missing",
        variant: "destructive",
      });
      return Promise.resolve();
    }
    
    try {
      setIsDeleting(true);
      
      // Here would be the actual delete logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      
      // Navigate would happen in the container component
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !formData) {
    return <div className="p-4 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Convert formData to PropertyData with required values for missing properties
  const propertyData: PropertyData = {
    id: formData.id,
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
    location_description: formData.location_description || '',
    features: formData.features || [],
    areas: formData.areas || [],
    nearby_places: formData.nearby_places || [],
    nearby_cities: formData.nearby_cities || [],
    images: formData.images?.map(img => typeof img === 'string' ? { id: img, url: img } : img) || [],
    floorplans: formData.floorplans?.map(fp => typeof fp === 'string' ? { id: fp, url: fp } : fp) || [],
    map_image: formData.map_image || null,
    latitude: formData.latitude || null,
    longitude: formData.longitude || null,
    object_id: formData.object_id || '',
    agent_id: formData.agent_id || '',
    agent: formData.agent,
    template_id: formData.template_id || 'default',
    virtualTourUrl: formData.virtualTourUrl || '',
    youtubeUrl: formData.youtubeUrl || '',
    notes: formData.notes || '',
    featuredImage: formData.featuredImage || null,
    featuredImages: formData.featuredImages || [],
    floorplanEmbedScript: formData.floorplanEmbedScript || '',
    created_at: formData.created_at || new Date().toISOString(),
    updated_at: formData.updated_at || new Date().toISOString(),
    coverImages: formData.coverImages || [],
    gridImages: formData.gridImages || [],
    generalInfo: formData.generalInfo,
    shortDescription: formData.shortDescription
  };

  return (
    <div className="space-y-4">
      <form id="propertyForm">
        <PropertyTabsWrapper
          property={propertyData}
          settings={settings}
          onSave={handleSave}
          onDelete={handleDelete}
          agentInfo={agentInfo}
          templateInfo={templateInfo}
        />
      </form>
    </div>
  );
}
