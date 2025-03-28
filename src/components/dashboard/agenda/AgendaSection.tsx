
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { useAgendaDialogs } from "@/components/property/dashboard/agenda/useAgendaDialogs";
import { AgendaViewContent } from "./AgendaViewContent";
import { AgendaDialogs } from "./AgendaDialogs";
import { DateRange } from "react-day-picker";
import { WeeklyCalendarView } from "./WeeklyCalendarView";

export function AgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const { 
    agendaItems, 
    isLoading, 
    addAgendaItem, 
    updateAgendaItem, 
    deleteAgendaItem 
  } = useAgenda(propertyId || undefined);
  
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
    handleAddButtonClick,
    setSelectedPropertyId
  } = agendaDialogProps;
  
  // Set the selected property ID from URL if available
  useState(() => {
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    }
  });
  
  const handleAddAgendaItem = () => {
    if (agendaDialogProps.selectedDate && agendaDialogProps.title) {
      const { 
        title, 
        description, 
        selectedDate, 
        selectedTime, 
        endDate, 
        endTime, 
        additionalUsers,
        selectedPropertyId
      } = agendaDialogProps;
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
      
      // Use the property ID from the URL if available, otherwise use the one from the dialog
      const finalPropertyId = propertyId || selectedPropertyId;
      
      console.log("Adding agenda item with propertyId:", finalPropertyId);
      
      addAgendaItem(
        title, 
        description, 
        formattedDate, 
        selectedTime,
        formattedEndDate,
        endTime,
        additionalUsers,
        finalPropertyId
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
        editAdditionalUsers,
        selectedPropertyId
      } = agendaDialogProps;
      
      const formattedDate = editDate.toISOString().split('T')[0];
      const formattedEndDate = editEndDate ? editEndDate.toISOString().split('T')[0] : null;
      
      // Use the property ID from the URL if available, otherwise use the one from the selected item or dialog
      const finalPropertyId = propertyId || selectedAgendaItem.property_id || selectedPropertyId;
      
      updateAgendaItem(
        selectedAgendaItem.id, 
        editTitle, 
        editDescription, 
        formattedDate, 
        editTime,
        formattedEndDate,
        editEndTime,
        editAdditionalUsers,
        finalPropertyId
      );
      
      agendaDialogProps.setIsEditDialogOpen(false);
    }
  };

  // Create a wrapper function that matches the expected parameter types
  const handleSetDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Create a parameter-less function for onAddClick
  const handleAddClick = () => {
    handleAddButtonClick(new Event('click') as unknown as React.MouseEvent);
  };
  
  return (
    <CardContent className="p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddButtonClick} size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      <TabsContent value="weekly" className="mt-0">
        <WeeklyCalendarView
          agendaItems={safeAgendaItems}
          isLoading={isLoading}
          onItemClick={handleAgendaItemClick}
        />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        <AgendaViewContent 
          view="calendar"
          safeAgendaItems={safeAgendaItems}
          isLoading={isLoading}
          dateRange={dateRange}
          setDateRange={handleSetDateRange}
          filteredAgendaItems={filteredAgendaItems}
          onItemClick={handleAgendaItemClick}
          onAddClick={handleAddClick}
        />
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <AgendaViewContent 
          view="list"
          safeAgendaItems={safeAgendaItems}
          isLoading={isLoading}
          dateRange={dateRange}
          setDateRange={handleSetDateRange}
          filteredAgendaItems={filteredAgendaItems}
          onItemClick={handleAgendaItemClick}
          onAddClick={handleAddClick}
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
