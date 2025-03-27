
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { useAgendaDialogs } from "@/components/property/dashboard/agenda/useAgendaDialogs";
import { AgendaViewContent } from "./AgendaViewContent";
import { AgendaDialogs } from "./AgendaDialogs";

export function AgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("calendar");
  
  const { 
    agendaItems, 
    isLoading, 
    addAgendaItem, 
    updateAgendaItem, 
    deleteAgendaItem 
  } = useAgenda();
  
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
    handleAddButtonClick
  } = agendaDialogProps;
  
  const handleAddAgendaItem = () => {
    if (agendaDialogProps.selectedDate && agendaDialogProps.title) {
      const { 
        title, 
        description, 
        selectedDate, 
        selectedTime, 
        endDate, 
        endTime, 
        additionalUsers 
      } = agendaDialogProps;
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
      
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
        editAdditionalUsers 
      } = agendaDialogProps;
      
      const formattedDate = editDate.toISOString().split('T')[0];
      const formattedEndDate = editEndDate ? editEndDate.toISOString().split('T')[0] : null;
      
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
      
      agendaDialogProps.setIsEditDialogOpen(false);
    }
  };
  
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
        <AgendaViewContent 
          view="calendar"
          safeAgendaItems={safeAgendaItems}
          isLoading={isLoading}
          dateRange={dateRange}
          setDateRange={setDateRange}
          filteredAgendaItems={filteredAgendaItems}
          onItemClick={handleAgendaItemClick}
          onAddClick={handleAddButtonClick}
        />
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <AgendaViewContent 
          view="list"
          safeAgendaItems={safeAgendaItems}
          isLoading={isLoading}
          dateRange={dateRange}
          setDateRange={setDateRange}
          filteredAgendaItems={filteredAgendaItems}
          onItemClick={handleAgendaItemClick}
          onAddClick={handleAddButtonClick}
        />
      </TabsContent>
      
      <AgendaDialogs 
        agendaDialogProps={agendaDialogProps}
        onAddAgendaItem={handleAddAgendaItem}
        onDeleteAgendaItem={handleDeleteAgendaItem}
        onUpdateAgendaItem={handleUpdateAgendaItem}
      />
    </CardContent>
  );
}
