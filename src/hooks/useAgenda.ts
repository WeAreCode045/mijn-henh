
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { fetchAgendaItems, addAgendaItem as addItem, deleteAgendaItem as deleteItem, updateAgendaItem as updateItem } from "@/hooks/agenda/agendaService";
import { UseAgendaReturn } from "@/hooks/agenda/types";

export function useAgenda(propertyId?: string): UseAgendaReturn {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchItems = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchAgendaItems(user.id, propertyId);
      setAgendaItems(data);
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
    if (!user?.id) return;

    try {
      await addItem(
        user.id,
        title,
        description,
        eventDate,
        eventTime,
        endDate,
        endTime,
        additionalUsers,
        propertyId
      );
      
      toast({
        title: "Success",
        description: "Agenda item added successfully",
      });
      
      fetchItems();
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
      await deleteItem(agendaItemId);
      
      toast({
        title: "Success",
        description: "Agenda item deleted successfully",
      });
      
      fetchItems();
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
      await updateItem(
        agendaItemId,
        title,
        description,
        eventDate,
        eventTime,
        endDate,
        endTime,
        additionalUsers,
        propertyId
      );
      
      toast({
        title: "Success",
        description: "Agenda item updated successfully",
      });
      
      fetchItems();
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
      fetchItems();
    }
  }, [user?.id, propertyId]);

  return {
    agendaItems,
    isLoading,
    addAgendaItem,
    deleteAgendaItem,
    updateAgendaItem,
    refreshAgendaItems: fetchItems
  };
}
