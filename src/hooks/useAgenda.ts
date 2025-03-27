
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export interface AgendaItem {
  id: string;
  property_id?: string | null;
  title: string;
  description?: string | null;
  event_date: string;
  event_time: string;
  end_time?: string | null;
  till_date?: string | null;
  invited_users?: string[] | null;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
  } | null;
}

export function useAgenda() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchAgendaItems = async () => {
    if (!profile?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
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
    propertyId?: string | null,
    endTime?: string | null,
    tillDate?: string | null,
    invitedUsers?: string[] | null
  ) => {
    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .insert({
          property_id: propertyId || null,
          title,
          description,
          event_date: eventDate,
          event_time: eventTime,
          end_time: endTime || null,
          till_date: tillDate || null,
          invited_users: invitedUsers || null
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
    propertyId?: string | null,
    endTime?: string | null,
    tillDate?: string | null,
    invitedUsers?: string[] | null
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
          end_time: endTime || null,
          till_date: tillDate || null,
          invited_users: invitedUsers || null
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
    if (profile?.id) {
      fetchAgendaItems();
    }
  }, [profile?.id]);

  return {
    agendaItems,
    isLoading,
    addAgendaItem,
    deleteAgendaItem,
    updateAgendaItem,
    refreshAgendaItems: fetchAgendaItems
  };
}
