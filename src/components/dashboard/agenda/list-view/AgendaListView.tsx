
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { LoadingIndicator } from "./LoadingIndicator";
import { DateNavigation } from "./DateNavigation";
import { FilteredAgendaItems } from "./FilteredAgendaItems";
import { useAgendaListView } from "./hooks/useAgendaListView";

interface AgendaListViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
  onAddClick?: () => void;
}

export function AgendaListView({ 
  agendaItems, 
  isLoading,
  onItemClick,
  onAddClick
}: AgendaListViewProps) {
  const {
    filterValue,
    setFilterValue,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    displayedItems
  } = useAgendaListView(agendaItems, isLoading);
  
  console.log("AgendaListView - Items count:", agendaItems?.length || 0, "Displayed count:", displayedItems?.length || 0);
  
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-4">
      <DateNavigation
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      
      <FilteredAgendaItems
        originalItems={agendaItems}
        displayedItems={displayedItems}
        onItemClick={onItemClick}
        onAddClick={onAddClick}
      />
    </div>
  );
}
