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
    console.log("useAgenda - Fetching agenda items for userId:", user.id, "propertyId:", propertyId);
    
    try {
      const data = await fetchAgendaItems(user.id, propertyId);
      console.log("useAgenda - Fetched agenda items:", data);
      setAgendaItems(data);
    } catch (error: any) {
      console.error('Error fetching agenda items:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load agenda items",
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
    itemPropertyId?: string | null
  ) => {
    if (!user?.id) return;

    try {
      // If no property ID was provided for this specific item, use the one provided to the hook
      const finalPropertyId = itemPropertyId !== undefined ? itemPropertyId : propertyId;
      
      console.log(`Adding agenda item with propertyId: ${finalPropertyId || 'none'}`);
      
      await addItem(
        user.id,
        title,
        description,
        eventDate,
        eventTime,
        endDate,
        endTime && endTime.trim() !== "" ? endTime : null,
        additionalUsers,
        finalPropertyId
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
        description: error.message || "Failed to add agenda item",
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
    itemPropertyId?: string | null
  ) => {
    try {
      // Use the specific item property ID if provided, otherwise use the hook's property ID
      const finalPropertyId = itemPropertyId !== undefined ? itemPropertyId : propertyId;
      
      // Make sure empty string for endTime is converted to null
      const safeEndTime = endTime && endTime.trim() !== "" ? endTime : null;
      
      await updateItem(
        agendaItemId,
        title,
        description,
        eventDate,
        eventTime,
        endDate,
        safeEndTime,
        additionalUsers,
        finalPropertyId
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
      console.log("useAgenda - Initial fetch with userId:", user.id);
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
