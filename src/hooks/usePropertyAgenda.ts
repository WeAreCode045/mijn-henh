
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface AgendaItem {
  id: string;
  property_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  created_at: string;
}

export function usePropertyAgenda(propertyId: string) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgendaItems = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching agenda items for property:', propertyId);
      const { data, error } = await supabase
        .from('property_agenda_items')
        .select('*')
        .eq('property_id', propertyId)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (error) throw error;
      console.log('Agenda items fetched:', data);
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

  const addAgendaItem = async (title: string, description: string | null, eventDate: string, eventTime: string) => {
    try {
      console.log('Adding agenda item:', {
        property_id: propertyId,
        title,
        description,
        event_date: eventDate,
        event_time: eventTime
      });
      
      const { data, error } = await supabase
        .from('property_agenda_items')
        .insert({
          property_id: propertyId,
          title,
          description,
          event_date: eventDate,
          event_time: eventTime
        })
        .select();

      if (error) throw error;
      
      console.log('Agenda item added:', data);
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

  const deleteAgendaItem = async (itemId: string) => {
    try {
      console.log('Deleting agenda item:', itemId);
      const { error } = await supabase
        .from('property_agenda_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      console.log('Agenda item deleted successfully');
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

  useEffect(() => {
    if (propertyId) {
      fetchAgendaItems();
    }
  }, [propertyId]);

  return {
    agendaItems,
    isLoading,
    addAgendaItem,
    deleteAgendaItem,
    refreshAgendaItems: fetchAgendaItems
  };
}
