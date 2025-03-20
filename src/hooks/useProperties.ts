
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyData } from "@/types/property";
import { useAuth } from "@/providers/AuthProvider";

export const useProperties = () => {
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();

  const fetchProperties = async () => {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        agent:profiles(id, full_name, email, phone, avatar_url)
      `);

    if (!isAdmin) {
      query = query.eq('agent_id', profile.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(item => {
      // Add template_id if missing 
      const propertyWithTemplateId = {
        ...item,
        agent: item.agent || null,
        template_id: "default" // Add a default template_id since we've removed templates functionality
      };
      return transformSupabaseData(propertyWithTemplateId);
    });
  };

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties', profile?.id, isAdmin],
    queryFn: fetchProperties,
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het verwijderen van de brochure",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Brochure verwijderd",
      description: "De brochure is succesvol verwijderd",
    });
  };

  // Simple transformer function for consistency
  function transformSupabaseData(data: any): PropertyData {
    return {
      id: data.id,
      title: data.title || "",
      price: data.price || "",
      address: data.address || "",
      bedrooms: data.bedrooms || "",
      bathrooms: data.bathrooms || "",
      sqft: data.sqft || "",
      livingArea: data.livingArea || "",
      buildYear: data.buildYear || "",
      garages: data.garages || "",
      energyLabel: data.energyLabel || "",
      hasGarden: data.hasGarden || false,
      description: data.description || "",
      shortDescription: data.shortDescription || "",
      location_description: data.location_description || "",
      features: JSON.parse(data.features || '[]'),
      areas: JSON.parse(data.areas || '[]'),
      nearby_places: JSON.parse(data.nearby_places || '[]'),
      nearby_cities: JSON.parse(data.nearby_cities || '[]'),
      images: data.property_images || [],
      map_image: data.map_image || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      object_id: data.object_id || "",
      agent_id: data.agent_id || "",
      agent: data.agent,
      notes: data.notes || "",
      virtualTourUrl: data.virtualTourUrl || "",
      youtubeUrl: data.youtubeUrl || "",
      floorplanEmbedScript: data.floorplanEmbedScript || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
      template_id: data.template_id || "default" // Add default template_id
    };
  }

  return {
    properties,
    isLoading,
    error,
    handleDelete,
  };
};
