
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { usePropertyAgenda } from "@/hooks/property-agenda";
import { useAgendaFiltering } from "./agenda/useAgendaFiltering";
import { useAgendaDialogs } from "./agenda/useAgendaDialogs";
import { DateRangeSelector } from "./agenda/DateRangeSelector";
import { AgendaItemList } from "./agenda/AgendaItemList";
import { ViewAgendaItemDialog } from "./agenda/ViewAgendaItemDialog";
import { AddEditAgendaDialog } from "./agenda/AddEditAgendaDialog";

interface AgendaCardProps {
  propertyId: string;
}

export function AgendaCard({ propertyId }: AgendaCardProps) {
  const { agendaItems, isLoading, addAgendaItem, deleteAgendaItem, updateAgendaItem } = usePropertyAgenda(propertyId);
  const { dateRange, setDateRange, filteredAgendaItems } = useAgendaFiltering(agendaItems);
  
  const {
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
  } = useAgendaDialogs();

  const handleAddAgendaItem = () => {
    if (selectedDate && title) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : null;
      
      addAgendaItem(
        title, 
        description, 
        formattedDate, 
        selectedTime, 
        formattedEndDate,
        endTime,
        additionalUsers
      );
      
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteAgendaItem = () => {
    if (selectedAgendaItem) {
      deleteAgendaItem(selectedAgendaItem.id);
      setIsViewDialogOpen(false);
    }
  };

  const handleUpdateAgendaItem = () => {
    if (selectedAgendaItem && editDate) {
      const formattedDate = format(editDate, "yyyy-MM-dd");
      const formattedEndDate = editEndDate ? format(editEndDate, "yyyy-MM-dd") : null;
      
      updateAgendaItem(
        selectedAgendaItem.id, 
        editTitle, 
        editDescription, 
        formattedDate, 
        editTime,
        formattedEndDate,
        editEndTime,
        editAdditionalUsers
      );
      
      setIsEditDialogOpen(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Agenda</CardTitle>
        <Button 
          onClick={handleAddButtonClick} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add agenda item</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">Agenda Items</h4>
            <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          
          <AgendaItemList 
            filteredAgendaItems={filteredAgendaItems} 
            isLoading={isLoading}
            onItemClick={handleAgendaItemClick}
          />
        </div>
      </CardContent>

      {/* Add Agenda Item Dialog */}
      <AddEditAgendaDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddAgendaItem}
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
          selectedAgendaItem={selectedAgendaItem}
          onDelete={handleDeleteAgendaItem}
          onEdit={handleEditButtonClick}
        />
      )}

      {/* Edit Agenda Item Dialog */}
      {selectedAgendaItem && (
        <AddEditAgendaDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleUpdateAgendaItem}
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
    </Card>
  );
}
