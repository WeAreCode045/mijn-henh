
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyData } from "@/types/property";
import { transformSupabaseData } from "@/components/property/webview/utils/transformSupabaseData";
import { useAuth } from "@/providers/AuthProvider";
import { getSupabaseClient } from "@/integrations/supabase/clientManager";

export const useProperties = () => {
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();

  const fetchProperties = async () => {
    // Get the best available client
    const supabase = await getSupabaseClient();
    if (!supabase) {
      throw new Error('No Supabase client available');
    }
    
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
    try {
      // Get the best available client
      const supabase = await getSupabaseClient();
      if (!supabase) {
        throw new Error('No Supabase client available');
      }
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Brochure verwijderd",
        description: "De brochure is succesvol verwijderd",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het verwijderen van de brochure",
        variant: "destructive",
      });
    }
  };

  return {
    properties,
    isLoading,
    error,
    handleDelete,
  };
};
