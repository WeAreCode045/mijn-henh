
import { useState } from "react";
import { AgendaItem } from "./types";

export function useAgendaDialogs() {
  // Dialog open states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null);
  
  // Add form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [additionalUsers, setAdditionalUsers] = useState<string[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState<string | null>("");
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editEndDate, setEditEndDate] = useState<Date | null>(null);
  const [editEndTime, setEditEndTime] = useState<string | null>(null);
  const [editAdditionalUsers, setEditAdditionalUsers] = useState<string[]>([]);
  
  // Available users for selection
  const availableUsers: { id: string; name: string }[] = [];
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedDate(new Date());
    setSelectedTime("09:00");
    setEndDate(null);
    setEndTime(null);
    setAdditionalUsers([]);
    // Don't reset selectedPropertyId to preserve context
  };
  
  const handleAgendaItemClick = (item: AgendaItem) => {
    setSelectedAgendaItem(item);
    setIsViewDialogOpen(true);
    
    // Also populate edit form
    setEditTitle(item.title);
    setEditDescription(item.description);
    
    if (item.event_date) {
      setEditDate(new Date(item.event_date));
    }
    
    setEditTime(item.event_time || "09:00");
    
    if (item.end_date) {
      setEditEndDate(new Date(item.end_date));
    } else {
      setEditEndDate(null);
    }
    
    setEditEndTime(item.end_time);
    setEditAdditionalUsers(item.additional_users || []);
    setSelectedPropertyId(item.property_id);
  };
  
  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };
  
  return {
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
    selectedPropertyId,
    setSelectedPropertyId,
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
