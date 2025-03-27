import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarX, PlusCircle } from "lucide-react";
import { useAgenda } from "@/hooks/useAgenda";
import { format } from "date-fns";
import { useAuth } from "@/providers/AuthProvider";
import { DateRangeSelector } from "../property/dashboard/agenda/DateRangeSelector";
import { AgendaItemList } from "../property/dashboard/agenda/AgendaItemList";
import { ViewAgendaItemDialog } from "../property/dashboard/agenda/ViewAgendaItemDialog";
import { AddEditAgendaDialog } from "../property/dashboard/agenda/AddEditAgendaDialog";
import { useAgendaFiltering } from "../property/dashboard/agenda/useAgendaFiltering";
import { useAgendaDialogs } from "../property/dashboard/agenda/useAgendaDialogs";
import { AgendaCalendarView } from "./AgendaCalendarView";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

export function AgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const { user } = useAuth();
  
  const { agendaItems: fetchedAgendaItems, isLoading, addAgendaItem, updateAgendaItem, deleteAgendaItem } = useAgenda();
  
  const safeAgendaItems: AgendaItem[] = fetchedAgendaItems;
  
  const { dateRange, setDateRange, filteredAgendaItems } = useAgendaFiltering(safeAgendaItems);
  
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
        editAdditionalUsers,
        selectedAgendaItem.property_id
      );
      
      setIsEditDialogOpen(false);
    }
  };
  
  const EmptyAgendaNotification = () => (
    <div className="flex flex-col items-center justify-center py-6 px-4 bg-muted/20 rounded-lg border border-muted mt-4">
      <CalendarX className="h-12 w-12 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No Events Scheduled</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
        Your agenda is currently empty. Click the "Add Event" button above to schedule your first event.
      </p>
      <Button onClick={handleAddButtonClick} variant="outline" className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Your First Event
      </Button>
    </div>
  );
  
  return (
    <CardContent className="p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddButtonClick} size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      <TabsContent value="calendar" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <AgendaCalendarView 
              agendaItems={agendaItems} 
              isLoading={isLoading}
              onDayClick={() => {}}
              className="w-full"
              compactMode={true}
            />
          </div>
          <div className="md:col-span-3">
            {!isLoading && agendaItems.length === 0 ? (
              <EmptyAgendaNotification />
            ) : (
              <div className="flex flex-col space-y-3">
                <div className="flex justify-end">
                  <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
                </div>
                <AgendaItemList 
                  filteredAgendaItems={filteredAgendaItems} 
                  isLoading={isLoading} 
                  onItemClick={handleAgendaItemClick}
                />
              </div>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        {!isLoading && agendaItems.length === 0 ? (
          <EmptyAgendaNotification />
        ) : (
          <div className="flex flex-col space-y-3">
            <div className="flex justify-end">
              <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
            </div>
            <AgendaItemList 
              filteredAgendaItems={filteredAgendaItems} 
              isLoading={isLoading} 
              onItemClick={handleAgendaItemClick}
            />
          </div>
        )}
      </TabsContent>
      
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
    </CardContent>
  );
}
