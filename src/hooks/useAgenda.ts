import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export interface AgendaItem {
  id: string;
  property_id?: string | null;
  creator_id: string;
  title: string;
  description?: string | null;
  event_date: string;
  event_time: string;
  end_date?: string | null;
  end_time?: string | null;
  additional_users?: string[];
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
  } | null;
}

export function useAgenda(propertyId?: string) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchAgendaItems = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('property_agenda_items')
        .select(`
          *,
          property:property_id (
            id,
            title
          )
        `)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      } else {
        query = query.or(`creator_id.eq.${user.id},additional_users.cs.{"${user.id}"}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAgendaItems(data || []);
    } catch (error: any) {
      console.error('Error fetching agenda items:', error);
      toast({
        title: "Error",
        description: "Failed to load agenda items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAgendaItem = async (
    title: string, 
    description: string | null, 
    eventDate: string, 
    eventTime: string,
    endDate: string | null = null,
    endTime: string | null = null,
    additionalUsers: string[] = [],
    propertyId?: string | null
  ) => {
    if (!user?.id) return null;

    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .insert({
          creator_id: user.id,
          property_id: propertyId || null,
          title,
          description,
          event_date: eventDate,
          event_time: eventTime,
          end_date: endDate,
          end_time: endTime,
          additional_users: additionalUsers
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Agenda item added successfully",
      });
      
      fetchAgendaItems();
    } catch (error: any) {
      console.error('Error adding agenda item:', error);
      toast({
        title: "Error",
        description: "Failed to add agenda item",
        variant: "destructive",
      });
    }
  };

  const deleteAgendaItem = async (agendaItemId: string) => {
    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .delete()
        .eq('id', agendaItemId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Agenda item deleted successfully",
      });
      
      fetchAgendaItems();
    } catch (error: any) {
      console.error('Error deleting agenda item:', error);
      toast({
        title: "Error",
        description: "Failed to delete agenda item",
        variant: "destructive",
      });
    }
  };

  const updateAgendaItem = async (
    agendaItemId: string, 
    title: string, 
    description: string | null, 
    eventDate: string, 
    eventTime: string,
    endDate: string | null = null,
    endTime: string | null = null,
    additionalUsers: string[] = [],
    propertyId?: string | null
  ) => {
    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .update({
          property_id: propertyId,
          title,
          description,
          event_date: eventDate,
          event_time: eventTime,
          end_date: endDate,
          end_time: endTime,
          additional_users: additionalUsers
        })
        .eq('id', agendaItemId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Agenda item updated successfully",
      });
      
      fetchAgendaItems();
    } catch (error: any) {
      console.error('Error updating agenda item:', error);
      toast({
        title: "Error",
        description: "Failed to update agenda item",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAgendaItems();
    }
  }, [user?.id, propertyId]);

  return {
    agendaItems,
    isLoading,
    addAgendaItem,
    deleteAgendaItem,
    updateAgendaItem,
    refreshAgendaItems: fetchAgendaItems
  };
}
