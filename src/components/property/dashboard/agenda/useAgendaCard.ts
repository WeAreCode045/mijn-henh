
import { useState } from "react";
import { format } from "date-fns";
import { AgendaItem } from "./types";
import { usePropertyAgenda } from "@/hooks/property-agenda";
import { useAgendaFiltering } from "./useAgendaFiltering";
import { useAgendaDialogs } from "./useAgendaDialogs";

export function useAgendaCard(propertyId: string) {
  const { 
    agendaItems, 
    isLoading, 
    addAgendaItem, 
    deleteAgendaItem, 
    updateAgendaItem 
  } = usePropertyAgenda(propertyId);
  
  const { dateRange, setDateRange, filteredAgendaItems } = useAgendaFiltering(agendaItems);
  const agendaDialogs = useAgendaDialogs();
  
  const handleAddAgendaItem = () => {
    if (agendaDialogs.selectedDate && agendaDialogs.title) {
      const formattedDate = format(agendaDialogs.selectedDate, "yyyy-MM-dd");
      const formattedEndDate = agendaDialogs.endDate ? format(agendaDialogs.endDate, "yyyy-MM-dd") : null;
      
      addAgendaItem(
        agendaDialogs.title, 
        agendaDialogs.description, 
        formattedDate, 
        agendaDialogs.selectedTime, 
        formattedEndDate,
        agendaDialogs.endTime,
        agendaDialogs.additionalUsers
      );
      
      agendaDialogs.setIsAddDialogOpen(false);
      agendaDialogs.resetForm();
    }
  };

  const handleDeleteAgendaItem = () => {
    if (agendaDialogs.selectedAgendaItem) {
      deleteAgendaItem(agendaDialogs.selectedAgendaItem.id);
      agendaDialogs.setIsViewDialogOpen(false);
    }
  };

  const handleUpdateAgendaItem = () => {
    if (agendaDialogs.selectedAgendaItem && agendaDialogs.editDate) {
      const formattedDate = format(agendaDialogs.editDate, "yyyy-MM-dd");
      const formattedEndDate = agendaDialogs.editEndDate ? format(agendaDialogs.editEndDate, "yyyy-MM-dd") : null;
      
      updateAgendaItem(
        agendaDialogs.selectedAgendaItem.id, 
        agendaDialogs.editTitle, 
        agendaDialogs.editDescription, 
        formattedDate, 
        agendaDialogs.editTime,
        formattedEndDate,
        agendaDialogs.editEndTime,
        agendaDialogs.editAdditionalUsers
      );
      
      agendaDialogs.setIsEditDialogOpen(false);
    }
  };
  
  return {
    agendaItems,
    filteredAgendaItems,
    isLoading,
    dateRange,
    setDateRange,
    ...agendaDialogs,
    handleAddAgendaItem,
    handleDeleteAgendaItem,
    handleUpdateAgendaItem
  };
}
