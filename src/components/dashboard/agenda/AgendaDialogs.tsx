
import { ViewAgendaItemDialog } from "@/components/property/dashboard/agenda/ViewAgendaItemDialog";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { AddEditAgendaDialog } from "@/components/property/dashboard/agenda/AddEditAgendaDialog";

interface AgendaDialogsProps {
  agendaDialogProps: {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
    isViewDialogOpen: boolean;
    setIsViewDialogOpen: (open: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (open: boolean) => void;
    selectedAgendaItem: AgendaItem | null;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
    endDate: Date | undefined;
    setEndDate: (date: Date | undefined) => void;
    endTime: string;
    setEndTime: (time: string) => void;
    additionalUsers: string[];
    setAdditionalUsers: (users: string[]) => void;
    editTitle: string;
    setEditTitle: (title: string) => void;
    editDescription: string;
    setEditDescription: (description: string) => void;
    editDate: Date | undefined;
    setEditDate: (date: Date | undefined) => void;
    editTime: string;
    setEditTime: (time: string) => void;
    editEndDate: Date | undefined;
    setEditEndDate: (date: Date | undefined) => void;
    editEndTime: string;
    setEditEndTime: (time: string) => void;
    editAdditionalUsers: string[];
    setEditAdditionalUsers: (users: string[]) => void;
    availableUsers: { id: string; name: string }[];
    handleEditButtonClick: (e: React.MouseEvent) => void;
  };
  onAddAgendaItem: () => void;
  onDeleteAgendaItem: () => void;
  onUpdateAgendaItem: () => void;
}

export function AgendaDialogs({
  agendaDialogProps,
  onAddAgendaItem,
  onDeleteAgendaItem,
  onUpdateAgendaItem
}: AgendaDialogsProps) {
  const { 
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
    availableUsers,
    handleEditButtonClick
  } = agendaDialogProps;

  return (
    <>
      {/* Add Agenda Item Dialog */}
      <AddEditAgendaDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={onAddAgendaItem}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
        additionalUsers={additionalUsers}
        setAdditionalUsers={setAdditionalUsers}
        availableUsers={availableUsers}
        mode="add"
      />

      {/* View Agenda Item Dialog */}
      {selectedAgendaItem && (
        <ViewAgendaItemDialog
          isOpen={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          selectedAgendaItem={selectedAgendaItem ? { 
            ...selectedAgendaItem, 
            property_id: "", 
            agent_id: "", 
            event_date: selectedAgendaItem.date.toISOString(), 
            event_time: selectedAgendaItem.time, 
            created_at: new Date().toISOString(), 
            updated_at: new Date().toISOString() 
          } : null}
          onDelete={onDeleteAgendaItem}
          onEdit={handleEditButtonClick}
        />
      )}

      {/* Edit Agenda Item Dialog */}
      {selectedAgendaItem && (
        <AddEditAgendaDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={onUpdateAgendaItem}
          title={editTitle}
          setTitle={setEditTitle}
          description={editDescription}
          setDescription={setEditDescription}
          selectedDate={editDate}
          setSelectedDate={setEditDate}
          selectedTime={editTime}
          setSelectedTime={setEditTime}
          endDate={editEndDate}
          setEndDate={setEditEndDate}
          endTime={editEndTime}
          setEndTime={setEditEndTime}
          additionalUsers={editAdditionalUsers}
          setAdditionalUsers={setEditAdditionalUsers}
          availableUsers={availableUsers}
          mode="edit"
        />
      )}
    </>
  );
}
