
import { format, parseISO } from "date-fns";
import { AgendaItem } from "./types";

interface AgendaItemListProps {
  filteredAgendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaItemList({ filteredAgendaItems, isLoading, onItemClick }: AgendaItemListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredAgendaItems.length === 0) {
    return (
      <p className="text-center py-2 text-muted-foreground text-sm">No items scheduled for this time period</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[270px] overflow-y-auto pr-1">
      {filteredAgendaItems.map((item) => (
        <div 
          key={item.id} 
          className="p-2 border rounded-md hover:bg-accent cursor-pointer flex items-center gap-2 transition-colors"
          onClick={() => onItemClick(item)}
        >
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-10 h-10 bg-muted rounded-md">
            <span className="text-xs font-medium">
              {format(parseISO(item.event_date), "dd")}
            </span>
            <span className="text-xs">
              {format(parseISO(item.event_date), "MMM")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{item.title}</h4>
            <p className="text-xs text-muted-foreground">
              {item.event_time.substring(0, 5)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
