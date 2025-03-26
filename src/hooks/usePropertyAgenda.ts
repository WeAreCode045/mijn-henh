
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

export function usePropertyAgenda(initialPropertyId?: string) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAgendaItems = async (propertyId?: string) => {
    const id = propertyId || initialPropertyId;
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_agenda_items')
        .select('*')
        .eq('property_id', id)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (error) throw error;
      
      if (data) {
        setAgendaItems(data as AgendaItem[]);
      }
    } catch (error) {
      console.error("Error fetching agenda items:", error);
      toast({
        title: "Error",
        description: "Failed to load agenda items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAgendaItem = async (title: string, description: string | null, date: string, time: string, propertyId?: string | null) => {
    const id = propertyId || initialPropertyId;
    if (!id) return null;

    try {
      const newItem = {
        property_id: id,
        title,
        description,
        event_date: date,
        event_time: time
      };

      const { data, error } = await supabase
        .from('property_agenda_items')
        .insert(newItem)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setAgendaItems(prevItems => [...prevItems, data[0] as AgendaItem]);
        return data[0];
      }
      return null;
    } catch (error) {
      console.error("Error adding agenda item:", error);
      toast({
        title: "Error",
        description: "Failed to add agenda item",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAgendaItem = async (id: string, title: string, description: string | null, date: string, time: string) => {
    try {
      const updates = {
        title,
        description,
        event_date: date,
        event_time: time
      };

      const { data, error } = await supabase
        .from('property_agenda_items')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setAgendaItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, ...updates } as AgendaItem : item
          )
        );
        return data[0];
      }
      return null;
    } catch (error) {
      console.error("Error updating agenda item:", error);
      toast({
        title: "Error",
        description: "Failed to update agenda item",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAgendaItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_agenda_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAgendaItems(prevItems => prevItems.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting agenda item:", error);
      toast({
        title: "Error",
        description: "Failed to delete agenda item",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (initialPropertyId) {
      fetchAgendaItems();
    }
  }, [initialPropertyId]);

  return {
    agendaItems,
    isLoading,
    fetchAgendaItems,
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem
  };
}
