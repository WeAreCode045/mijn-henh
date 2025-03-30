
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
  
  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>(new Date());
  const [editTime, setEditTime] = useState("09:00");
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(undefined);
  const [editEndTime, setEditEndTime] = useState("");
  const [editAdditionalUsers, setEditAdditionalUsers] = useState<string[]>([]);
  
  // Handler functions
  const handleSetDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleAgendaItemClick = (item: AgendaItem) => {
    setSelectedAgendaItem(item);
    setIsViewDialogOpen(true);
    
    // Populate edit form with item data
    if (item) {
      setEditTitle(item.title);
      setEditDescription(item.description || "");
      setEditDate(item.event_date ? new Date(item.event_date) : undefined);
      setEditTime(item.event_time || "09:00");
      setEditEndDate(item.end_date ? new Date(item.end_date) : undefined);
      setEditEndTime(item.end_time || "");
      setEditAdditionalUsers(item.additional_users || []);
    }
  };

  const handleAddButtonClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
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
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editDate,
    setEditDate,
    editTime,
    setEditTime,
    editEndDate,
    setEditEndDate,
    editEndTime,
    setEditEndTime,
    editAdditionalUsers,
    setEditAdditionalUsers,
    handleEditButtonClick
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
    if (selectedAgendaItem && editDate && editTitle) {
      await updateAgendaItem(
        selectedAgendaItem.id,
        editTitle,
        editDescription || null,
        editDate.toISOString().split('T')[0],
        editTime,
        editEndDate ? editEndDate.toISOString().split('T')[0] : null,
        editEndTime || null,
        editAdditionalUsers
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
