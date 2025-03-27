
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { 
  fetchPropertyAgendaItems, 
  addPropertyAgendaItem, 
  updatePropertyAgendaItem, 
  deletePropertyAgendaItem 
} from "./propertyAgendaService";
import { UsePropertyAgendaReturn } from "./types";

export function usePropertyAgenda(initialPropertyId?: string): UsePropertyAgendaReturn {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAgendaItems = async (propertyId?: string) => {
    const id = propertyId || initialPropertyId;
    if (!id || !user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchPropertyAgendaItems(id);
      setAgendaItems(data);
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
      const newAgendaItem = await addPropertyAgendaItem(
        user.id,
        id,
        title,
        description,
        date,
        time,
        endDate,
        endTime,
        additionalUsers
      );
      
      if (newAgendaItem) {
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
      const updatedItem = await updatePropertyAgendaItem(
        id,
        title,
        description,
        date,
        time,
        endDate,
        endTime,
        additionalUsers
      );

      if (updatedItem) {
        setAgendaItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { 
              ...item, 
              title, 
              description, 
              event_date: date,
              event_time: time,
              end_date: endDate,
              end_time: endTime,
              additional_users: additionalUsers
            } : item
          )
        );
        return updatedItem;
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
      const success = await deletePropertyAgendaItem(id);
      if (success) {
        setAgendaItems(prevItems => prevItems.filter(item => item.id !== id));
        return true;
      }
      return false;
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
