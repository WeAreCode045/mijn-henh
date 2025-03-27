
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyData } from "@/types/property";
import { transformSupabaseData } from "@/components/property/webview/utils/transformSupabaseData";
import { useAuth } from "@/providers/AuthProvider";
import { usePropertyDeletion } from "./usePropertyDeletion";

export const useProperties = () => {
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();
  const { deleteProperty } = usePropertyDeletion();
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

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
      const propertyWithAgent = {
        ...item,
        agent: item.agent || null
      };
      return transformSupabaseData(propertyWithAgent as any);
    });
  };

  const { data: properties = [], isLoading, error, refetch } = useQuery({
    queryKey: ['properties', profile?.id, isAdmin],
    queryFn: fetchProperties,
  });

  const handleDelete = async (id: string) => {
    const success = await deleteProperty(id);
    
    if (success) {
      refetch();
    }
  };

  return {
    properties,
    selectedProperty,
    setSelectedProperty,
    isLoading,
    error,
    handleDelete,
    refetch
  };
};
