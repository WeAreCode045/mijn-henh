import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePropertyEditLogger } from "@/hooks/usePropertyEditLogger";

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

export function usePropertyAgenda() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const { toast } = useToast();
  const { logPropertyChange } = usePropertyEditLogger();

  const fetchAgendaItems = useCallback(async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('property_agenda')
        .select('*')
        .eq('property_id', propertyId)
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setAgendaItems(data);
      }
    } catch (error: any) {
      console.error("Error fetching agenda items:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch agenda items",
        variant: "destructive",
      });
    }
  }, [toast]);

  const addAgendaItem = useCallback(async (propertyId: string, data: Omit<AgendaItem, 'id'>) => {
    try {
      const { data: newAgendaItem, error } = await supabase
        .from('property_agenda')
        .insert([{ property_id: propertyId, ...data }])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (newAgendaItem) {
        setAgendaItems((prevItems) => [...prevItems, newAgendaItem]);
        toast({
          title: "Success",
          description: "Agenda item added successfully",
        });

        await logPropertyChange(propertyId, "agenda", `Added new agenda item: ${data.title}`);
      }
    } catch (error: any) {
      console.error("Error adding agenda item:", error.message);
      toast({
        title: "Error",
        description: "Failed to add agenda item",
        variant: "destructive",
      });
    }
  }, [toast, logPropertyChange]);

  const updateAgendaItem = useCallback(async (propertyId: string, id: string, updates: Partial<AgendaItem>) => {
    try {
      const { data: updatedAgendaItem, error } = await supabase
        .from('property_agenda')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (updatedAgendaItem) {
        setAgendaItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updatedAgendaItem : item))
        );
        toast({
          title: "Success",
          description: "Agenda item updated successfully",
        });
      }
    } catch (error: any) {
      console.error("Error updating agenda item:", error.message);
      toast({
        title: "Error",
        description: "Failed to update agenda item",
        variant: "destructive",
      });
    }
  }, [toast]);

  const deleteAgendaItem = useCallback(async (propertyId: string, id: string) => {
    try {
      const { error } = await supabase
        .from('property_agenda')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAgendaItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Agenda item deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting agenda item:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete agenda item",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    agendaItems,
    fetchAgendaItems,
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,
  };
}
