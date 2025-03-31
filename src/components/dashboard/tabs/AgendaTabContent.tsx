
import { useAgenda } from "@/hooks/useAgenda";
import { useAgendaFiltering } from "@/components/property/dashboard/agenda/useAgendaFiltering";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AgendaViewContent } from "../agenda/AgendaViewContent";
import { WeeklyCalendarView } from "../agenda/weekly-calendar";
import { AgendaHeader } from "../agenda/components/AgendaHeader";
import { ViewAgendaItemDialog } from "@/components/property/dashboard/agenda/ViewAgendaItemDialog";
import { AddEditAgendaDialog } from "@/components/property/dashboard/agenda/AddEditAgendaDialog";
import { useAgendaDialogs } from "@/components/property/dashboard/agenda/useAgendaDialogs";
import { AgendaDialogs } from "../agenda/AgendaDialogs";

interface AgendaTabContentProps {
  onTabChange: (value: string) => void;
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick?: (item: AgendaItem) => void;
  onAddClick?: () => void;
}

export function AgendaTabContent({
  onTabChange,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick = () => {},
  onAddClick = () => {}
}: AgendaTabContentProps) {
  // Set up state for active tab (defaulting to "weekly")
  const [activeTab, setActiveTab] = useState("weekly");
  
  // Use the dialog hooks to manage agenda item dialogs
  const dialogProps = useAgendaDialogs();
  const { handleAgendaItemClick, handleAddButtonClick } = dialogProps;
  
  // Add state for CRUD operations
  const { addAgendaItem, updateAgendaItem, deleteAgendaItem } = useAgenda();
  
  // Handle tab change and propagate to parent
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };
  
  // Handle click on agenda item
  const handleItemClick = (item: AgendaItem) => {
    handleAgendaItemClick(item);
    if (onItemClick) onItemClick(item);
  };
  
  // Handle add button click
  const handleAddClick = () => {
    // Fix: Use a properly typed MouseEvent or just call the function directly
    // The error was here - we were passing a raw Event object to a function expecting React.MouseEvent
    handleAddButtonClick();
    if (onAddClick) onAddClick();
  };
  
  // Handle CRUD operations
  const handleAddAgendaItem = async () => {
    if (dialogProps.selectedDate && dialogProps.title) {
      try {
        await addAgendaItem(
          dialogProps.title,
          dialogProps.description || null,
          dialogProps.selectedDate.toISOString().split('T')[0],
          dialogProps.selectedTime,
          dialogProps.endDate ? dialogProps.endDate.toISOString().split('T')[0] : null,
          dialogProps.endTime || null,
          dialogProps.additionalUsers
        );
        dialogProps.setIsAddDialogOpen(false);
      } catch (error) {
        console.error("Error adding agenda item:", error);
      }
    }
  };
  
  const handleDeleteAgendaItem = async () => {
    if (dialogProps.selectedAgendaItem) {
      await deleteAgendaItem(dialogProps.selectedAgendaItem.id);
      dialogProps.setIsViewDialogOpen(false);
    }
  };
  
  const handleUpdateAgendaItem = async () => {
    if (dialogProps.selectedAgendaItem && dialogProps.editDate && dialogProps.editTitle) {
      await updateAgendaItem(
        dialogProps.selectedAgendaItem.id,
        dialogProps.editTitle,
        dialogProps.editDescription || null,
        dialogProps.editDate.toISOString().split('T')[0],
        dialogProps.editTime,
        dialogProps.editEndDate ? dialogProps.editEndDate.toISOString().split('T')[0] : null,
        dialogProps.editEndTime || null,
        dialogProps.editAdditionalUsers
      );
      
      dialogProps.setIsEditDialogOpen(false);
      dialogProps.setIsViewDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <AgendaHeader 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddButtonClick={handleAddClick}
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsContent value="weekly" className="mt-0">
          <WeeklyCalendarView
            agendaItems={safeAgendaItems}
            isLoading={isLoading}
            onItemClick={handleItemClick}
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
            onItemClick={handleItemClick}
            onAddClick={handleAddClick}
          />
        </TabsContent>
      </Tabs>
      
      <AgendaDialogs
        agendaDialogProps={dialogProps}
        onAddAgendaItem={handleAddAgendaItem}
        onDeleteAgendaItem={handleDeleteAgendaItem}
        onUpdateAgendaItem={handleUpdateAgendaItem}
      />
    </div>
  );
}
