
import { CardContent } from "@/components/ui/card";
import { DateRangeSelector } from "./DateRangeSelector";
import { AgendaItemList } from "./AgendaItemList";
import { AgendaItem, DateRange } from "./types";

interface AgendaCardContentProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  filteredAgendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaCardContent({
  dateRange,
  setDateRange,
  filteredAgendaItems,
  isLoading,
  onItemClick
}: AgendaCardContentProps) {
  return (
    <CardContent>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm">Agenda Items</h4>
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        
        <AgendaItemList 
          filteredAgendaItems={filteredAgendaItems} 
          isLoading={isLoading}
          onItemClick={onItemClick}
        />
      </div>
    </CardContent>
  );
}
