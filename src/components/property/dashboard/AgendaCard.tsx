
import { Card } from "@/components/ui/card";
import { useAgendaCard } from "./agenda/useAgendaCard";
import { AgendaCardHeader } from "./agenda/AgendaCardHeader";
import { AgendaCardContent } from "./agenda/AgendaCardContent";
import { AgendaCardDialogs } from "./agenda/AgendaCardDialogs";

interface AgendaCardProps {
  propertyId: string;
}

export function AgendaCard({ propertyId }: AgendaCardProps) {
  const {
    filteredAgendaItems,
    isLoading,
    dateRange,
    setDateRange,
    handleAgendaItemClick,
    handleAddButtonClick,
    handleEditButtonClick,
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
    handleAddAgendaItem,
    handleDeleteAgendaItem,
    handleUpdateAgendaItem
  } = useAgendaCard(propertyId);

  return (
    <Card className="h-full">
      <AgendaCardHeader onAddButtonClick={handleAddButtonClick} />
      
      <AgendaCardContent
        dateRange={dateRange}
        setDateRange={setDateRange}
        filteredAgendaItems={filteredAgendaItems}
        isLoading={isLoading}
        onItemClick={handleAgendaItemClick}
      />

      <AgendaCardDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedAgendaItem={selectedAgendaItem}
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
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editDate={editDate}
        setEditDate={setEditDate}
        editTime={editTime}
        setEditTime={setEditTime}
        editEndDate={editEndDate}
        setEditEndDate={setEditEndDate}
        editEndTime={editEndTime}
        setEditEndTime={setEditEndTime}
        editAdditionalUsers={editAdditionalUsers}
        setEditAdditionalUsers={setEditAdditionalUsers}
        availableUsers={availableUsers}
        handleAddAgendaItem={handleAddAgendaItem}
        handleDeleteAgendaItem={handleDeleteAgendaItem}
        handleUpdateAgendaItem={handleUpdateAgendaItem}
        handleEditButtonClick={handleEditButtonClick}
      />
    </Card>
  );
}
