
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyData } from "@/types/property";
import { transformSupabaseData } from "@/components/property/webview/utils/transformSupabaseData";
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
        agent:profiles(id, full_name, email, phone, photo_url:agent_photo)
      `);

    if (!isAdmin) {
      query = query.eq('agent_id', profile.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(item => {
      // Ensure each item has the agent property structured correctly
      const propertyWithAgent = {
        ...item,
        agent: item.agent || null
      };
      return transformSupabaseData(propertyWithAgent);
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

  return {
    properties,
    isLoading,
    error,
    handleDelete,
  };
};
