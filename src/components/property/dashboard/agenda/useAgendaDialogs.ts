
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { AgendaItem } from "./types";
import { useUsers } from "@/hooks/useUsers";

export function useAgendaDialogs() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState("");
  const [additionalUsers, setAdditionalUsers] = useState<string[]>([]);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>(new Date());
  const [editTime, setEditTime] = useState("");
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(undefined);
  const [editEndTime, setEditEndTime] = useState("");
  const [editAdditionalUsers, setEditAdditionalUsers] = useState<string[]>([]);

  // Get available users for the multi-select
  const { users } = useUsers();
  const availableUsers = users?.map(user => ({
    id: user.id,
    name: user.full_name || user.email || 'Unknown User'
  })) || [];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedDate(new Date());
    setSelectedTime("09:00");
    setEndDate(undefined);
    setEndTime("");
    setAdditionalUsers([]);
  };

  const handleAgendaItemClick = (item: AgendaItem) => {
    setSelectedAgendaItem(item);
    setIsViewDialogOpen(true);
  };

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddDialogOpen(true);
  };

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedAgendaItem) {
      setEditTitle(selectedAgendaItem.title);
      setEditDescription(selectedAgendaItem.description || "");
      setEditDate(parseISO(selectedAgendaItem.event_date));
      setEditTime(selectedAgendaItem.event_time.substring(0, 5));
      
      if (selectedAgendaItem.end_date) {
        setEditEndDate(parseISO(selectedAgendaItem.end_date));
      } else {
        setEditEndDate(undefined);
      }
      
      setEditEndTime(selectedAgendaItem.end_time?.substring(0, 5) || "");
      setEditAdditionalUsers(selectedAgendaItem.additional_users || []);
      
      setIsViewDialogOpen(false);
      setIsEditDialogOpen(true);
    }
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedAgendaItem,
    setSelectedAgendaItem,
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
    availableUsers,
    resetForm,
    handleAgendaItemClick,
    handleAddButtonClick,
    handleEditButtonClick
  };
}
