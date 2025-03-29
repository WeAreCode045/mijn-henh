
import { useState } from "react";
import { useAgenda } from "@/hooks/useAgenda";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { DateRange } from "react-day-picker";

export function useAgendaSection() {
  const [activeTab, setActiveTab] = useState("calendar");
  const { agendaItems, isLoading, addAgendaItem, deleteAgendaItem, updateAgendaItem } = useAgenda();
  
  // Safe access to agenda items
  const safeAgendaItems: AgendaItem[] = agendaItems || [];
  
  // Date range filtering
  const { dateRange, setDateRange, filteredAgendaItems } = useAgendaFiltering(safeAgendaItems);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState("");
  const [additionalUsers, setAdditionalUsers] = useState<string[]>([]);
  
  // Handler functions
  const handleSetDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleAgendaItemClick = (item: AgendaItem) => {
    setSelectedAgendaItem(item);
    setIsViewDialogOpen(true);
  };

  const handleAddButtonClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  // Dialog props for the child components
  const agendaDialogProps = {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen, 
    setIsEditDialogOpen,
    selectedAgendaItem,
    title,
    setTitle,
    description,
    setDescription,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    additionalUsers,
    setAdditionalUsers,
  };

  // Functions for CRUD operations
  const handleAddAgendaItem = async () => {
    if (selectedDate && title) {
      await addAgendaItem(
        title,
        description || null,
        selectedDate.toISOString().split('T')[0],
        selectedTime,
        endDate ? endDate.toISOString().split('T')[0] : null,
        endTime || null,
        additionalUsers
      );
      
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteAgendaItem = async () => {
    if (selectedAgendaItem) {
      await deleteAgendaItem(selectedAgendaItem.id);
      setIsViewDialogOpen(false);
    }
  };

  const handleUpdateAgendaItem = async () => {
    if (selectedAgendaItem && selectedDate && title) {
      await updateAgendaItem(
        selectedAgendaItem.id,
        title,
        description || null,
        selectedDate.toISOString().split('T')[0],
        selectedTime,
        endDate ? endDate.toISOString().split('T')[0] : null,
        endTime || null,
        additionalUsers
      );
      
      setIsEditDialogOpen(false);
      setIsViewDialogOpen(false);
    }
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
