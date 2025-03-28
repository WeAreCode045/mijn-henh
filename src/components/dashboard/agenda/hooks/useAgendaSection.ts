
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { useAgendaDialogs } from "@/components/property/dashboard/agenda/useAgendaDialogs";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function useAgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const { 
    agendaItems, 
    isLoading, 
    addAgendaItem, 
    updateAgendaItem, 
    deleteAgendaItem 
  } = useAgenda(propertyId || undefined);
  
  // Ensure we have a safe array of agenda items
  const safeAgendaItems = agendaItems || [];
  
  const { dateRange, setDateRange, filteredAgendaItems } = useAgendaFiltering(safeAgendaItems);
  
  const agendaDialogProps = useAgendaDialogs();
  
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    selectedAgendaItem,
    resetForm,
    handleAgendaItemClick,
    handleAddButtonClick,
    setSelectedPropertyId
  } = agendaDialogProps;
  
  // Set the selected property ID from URL if available
  useEffect(() => {
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    }
  }, [propertyId, setSelectedPropertyId]);
  
  const handleAddAgendaItem = () => {
    if (agendaDialogProps.selectedDate && agendaDialogProps.title) {
      const { 
        title, 
        description, 
        selectedDate, 
        selectedTime, 
        endDate, 
        endTime, 
        additionalUsers,
        selectedPropertyId
      } = agendaDialogProps;
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
      
      // Use the property ID from the URL if available, otherwise use the one from the dialog
      const finalPropertyId = propertyId || selectedPropertyId;
      
      console.log("Adding agenda item with propertyId:", finalPropertyId);
      
      addAgendaItem(
        title, 
        description, 
        formattedDate, 
        selectedTime,
        formattedEndDate,
        endTime,
        additionalUsers,
        finalPropertyId
      );
      
      setIsAddDialogOpen(false);
      resetForm();
    }
  };
  
  const handleDeleteAgendaItem = () => {
    if (selectedAgendaItem) {
      deleteAgendaItem(selectedAgendaItem.id);
      agendaDialogProps.setIsViewDialogOpen(false);
    }
  };
  
  const handleUpdateAgendaItem = () => {
    if (selectedAgendaItem && agendaDialogProps.editDate) {
      const { 
        editTitle, 
        editDescription, 
        editDate, 
        editTime, 
        editEndDate, 
        editEndTime, 
        editAdditionalUsers,
        selectedPropertyId
      } = agendaDialogProps;
      
      const formattedDate = editDate.toISOString().split('T')[0];
      const formattedEndDate = editEndDate ? editEndDate.toISOString().split('T')[0] : null;
      
      // Use the property ID from the URL if available, otherwise use the one from the selected item or dialog
      const finalPropertyId = propertyId || selectedAgendaItem.property_id || selectedPropertyId;
      
      updateAgendaItem(
        selectedAgendaItem.id, 
        editTitle, 
        editDescription, 
        formattedDate, 
        editTime,
        formattedEndDate,
        editEndTime,
        editAdditionalUsers,
        finalPropertyId
      );
      
      agendaDialogProps.setIsEditDialogOpen(false);
    }
  };

  // Create a wrapper function that matches the expected parameter types
  const handleSetDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Create a parameter-less function for onAddClick
  const handleAddClick = () => {
    handleAddButtonClick(new Event('click') as unknown as React.MouseEvent);
  };
  
  return {
    activeTab,
    setActiveTab,
    safeAgendaItems,
    isLoading,
    dateRange,
    handleSetDateRange,
    filteredAgendaItems,
    handleAgendaItemClick,
    handleAddButtonClick,
    handleAddClick,
    agendaDialogProps,
    handleAddAgendaItem,
    handleDeleteAgendaItem,
    handleUpdateAgendaItem
  };
}
