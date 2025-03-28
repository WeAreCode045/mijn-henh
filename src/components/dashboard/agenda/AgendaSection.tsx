
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

export function AgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("calendar");
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
      
      // Use the selected property ID from the dialog or fall back to the current propertyId from URL
      const selectedPropertyId = agendaDialogProps.selectedPropertyId || propertyId || undefined;
      
      console.log("Adding agenda item with propertyId:", selectedPropertyId);
      
      addAgendaItem(
        title, 
        description, 
        formattedDate, 
        selectedTime,
        formattedEndDate,
        endTime,
        additionalUsers,
        selectedPropertyId
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
        selectedPropertyId: dialogPropertyId
      } = agendaDialogProps;
      
      const formattedDate = editDate.toISOString().split('T')[0];
      const formattedEndDate = editEndDate ? editEndDate.toISOString().split('T')[0] : null;
      
      // Use the selected property ID from the dialog, the current one from the item, or fall back to URL
      const finalPropertyId = dialogPropertyId || selectedAgendaItem.property_id || propertyId || undefined;
      
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
        agendaDialogProps={{
          ...agendaDialogProps,
          selectedPropertyId: agendaDialogProps.selectedPropertyId || propertyId || null,
        }}
        onAddAgendaItem={handleAddAgendaItem}
        onDeleteAgendaItem={handleDeleteAgendaItem}
        onUpdateAgendaItem={handleUpdateAgendaItem}
      />
    </CardContent>
  );
}
