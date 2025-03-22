
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

export interface AgendaItem {
  id: string;
  property_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  created_at: string;
  updated_at: string;
}

export function usePropertyAgenda(propertyId: string) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const fetchAgendaItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_agenda_items')
        .select('*')
        .eq('property_id', propertyId)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (error) throw error;
      setAgendaItems(data || []);
    } catch (error: any) {
      console.error('Error fetching agenda items:', error);
      toast({
        title: "Error",
        description: "Failed to load property agenda items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAgendaItem = async (title: string, description: string, eventDate: string, eventTime: string) => {
    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .insert({
          property_id: propertyId,
          title,
          description,
          event_date: eventDate,
          event_time: eventTime
        });

      if (error) throw error;
      
      // Log the agenda item addition
      await logPropertyChange(
        propertyId,
        "property_agenda",
        "",
        `Added agenda item: ${title}`
      );
      
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
      // Get the agenda item title before deleting (for logging purposes)
      const { data: agendaItemData } = await supabase
        .from('property_agenda_items')
        .select('title')
        .eq('id', agendaItemId)
        .single();
        
      const agendaItemTitle = agendaItemData?.title || 'Unknown agenda item';
      
      const { error } = await supabase
        .from('property_agenda_items')
        .delete()
        .eq('id', agendaItemId);

      if (error) throw error;
      
      // Log the agenda item deletion
      await logPropertyChange(
        propertyId,
        "property_agenda",
        agendaItemTitle,
        "Agenda item deleted"
      );
      
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
    description: string, 
    eventDate: string, 
    eventTime: string
  ) => {
    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .update({
          title,
          description,
          event_date: eventDate,
          event_time: eventTime
        })
        .eq('id', agendaItemId);

      if (error) throw error;
      
      // Log the agenda item update
      await logPropertyChange(
        propertyId,
        "property_agenda",
        "Agenda item",
        `Updated: ${title}`
      );
      
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
    if (propertyId) {
      fetchAgendaItems();
    }
  }, [propertyId]);

  return {
    agendaItems,
    isLoading,
    addAgendaItem,
    deleteAgendaItem,
    updateAgendaItem,
    refreshAgendaItems: fetchAgendaItems
  };
}
