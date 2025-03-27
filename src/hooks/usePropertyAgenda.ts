
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function usePropertyAgenda(initialPropertyId?: string) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAgendaItems = async (propertyId?: string) => {
    const id = propertyId || initialPropertyId;
    if (!id || !user?.id) return;
    
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
        // Transform the data to ensure it matches the AgendaItem type
        const formattedData: AgendaItem[] = data.map(item => ({
          id: item.id,
          creator_id: item.creator_id,
          property_id: item.property_id,
          title: item.title,
          description: item.description,
          event_date: item.event_date,
          event_time: item.event_time,
          end_date: item.end_date,
          end_time: item.end_time,
          // Convert additional_users to string[] regardless of what form it comes in
          additional_users: Array.isArray(item.additional_users) 
            ? item.additional_users.map(user => String(user))
            : typeof item.additional_users === 'object' && item.additional_users !== null
              ? Object.values(item.additional_users).map(user => String(user))
              : [],
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        setAgendaItems(formattedData);
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

  const addAgendaItem = async (
    title: string, 
    description: string | null, 
    date: string, 
    time: string,
    endDate: string | null = null,
    endTime: string | null = null,
    additionalUsers: string[] = [],
    propertyId?: string | null
  ) => {
    const id = propertyId || initialPropertyId;
    if (!id || !user?.id) return null;

    try {
      const newItem = {
        creator_id: user.id,
        property_id: id,
        title,
        description,
        event_date: date,
        event_time: time,
        end_date: endDate,
        end_time: endTime,
        additional_users: additionalUsers
      };

      const { data, error } = await supabase
        .from('property_agenda_items')
        .insert(newItem)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Transform to match AgendaItem type
        const newAgendaItem: AgendaItem = {
          id: data[0].id,
          creator_id: data[0].creator_id,
          property_id: data[0].property_id,
          title: data[0].title,
          description: data[0].description,
          event_date: data[0].event_date,
          event_time: data[0].event_time,
          end_date: data[0].end_date,
          end_time: data[0].end_time,
          additional_users: Array.isArray(data[0].additional_users) 
            ? data[0].additional_users.map(user => String(user))
            : typeof data[0].additional_users === 'object' && data[0].additional_users !== null
              ? Object.values(data[0].additional_users).map(user => String(user))
              : [],
          created_at: data[0].created_at,
          updated_at: data[0].updated_at
        };
        
        setAgendaItems(prevItems => [...prevItems, newAgendaItem]);
        return newAgendaItem;
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

  const updateAgendaItem = async (
    id: string, 
    title: string, 
    description: string | null, 
    date: string, 
    time: string,
    endDate: string | null = null,
    endTime: string | null = null,
    additionalUsers: string[] = []
  ) => {
    if (!user?.id) return null;
    
    try {
      const updates = {
        title,
        description,
        event_date: date,
        event_time: time,
        end_date: endDate,
        end_time: endTime,
        additional_users: additionalUsers
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
    if (initialPropertyId && user?.id) {
      fetchAgendaItems();
    }
  }, [initialPropertyId, user?.id]);

  return {
    agendaItems,
    isLoading,
    fetchAgendaItems,
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem
  };
}
