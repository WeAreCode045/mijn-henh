
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { AgendaItem } from "./types";

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
  
  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>(new Date());
  const [editTime, setEditTime] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedDate(new Date());
    setSelectedTime("09:00");
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
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editDate,
    setEditDate,
    editTime,
    setEditTime,
    resetForm,
    handleAgendaItemClick,
    handleAddButtonClick,
    handleEditButtonClick
  };
}
