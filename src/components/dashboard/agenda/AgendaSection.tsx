
import { CardContent } from "@/components/ui/card";
import { useAgendaSection } from "./hooks/useAgendaSection";
import { AgendaHeader } from "./components/AgendaHeader";
import { AgendaTabContent } from "./components/AgendaTabContent";
import { AgendaDialogs } from "./AgendaDialogs";

export function AgendaSection() {
  const {
    activeTab,
    setActiveTab,
    safeAgendaItems,
    isLoading,
    dateRange,
    handleSetDateRange,
    filteredAgendaItems,
    handleAgendaItemClick,
    handleAddButtonClick,
    handleAddClick,
    agendaDialogProps,
    handleAddAgendaItem,
    handleDeleteAgendaItem,
    handleUpdateAgendaItem
  } = useAgendaSection();
  
  return (
    <CardContent className="p-4 pt-0">
      <AgendaHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddButtonClick={handleAddButtonClick}
      />
      
      <AgendaTabContent 
        activeTab={activeTab}
        safeAgendaItems={safeAgendaItems}
        isLoading={isLoading}
        dateRange={dateRange}
        setDateRange={handleSetDateRange}
        filteredAgendaItems={filteredAgendaItems}
        onItemClick={handleAgendaItemClick}
        onAddClick={handleAddClick}
      />
      
      <AgendaDialogs 
        agendaDialogProps={agendaDialogProps}
        onAddAgendaItem={handleAddAgendaItem}
        onDeleteAgendaItem={handleDeleteAgendaItem}
        onUpdateAgendaItem={handleUpdateAgendaItem}
      />
    </CardContent>
  );
}
