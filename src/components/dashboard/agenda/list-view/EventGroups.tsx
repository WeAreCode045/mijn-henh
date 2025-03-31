
import { parseISO, format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { groupEventsByDay } from "./utils";
import { EventItem } from "./EventItem";

interface EventGroupsProps {
  filteredItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  showPastEvents?: boolean;
}

export function EventGroups({ 
  filteredItems, 
  onItemClick,
  showPastEvents = true
}: EventGroupsProps) {
  const groupedEvents = groupEventsByDay(filteredItems);
  
  return (
    <div className="space-y-6">
      {groupedEvents.length > 0 ? (
        groupedEvents.map(group => (
          <div key={group.date.toISOString()} className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              {format(group.date, "EEEE, d MMMM, yyyy")}
            </h3>
            <div className="space-y-2">
              {group.items.map(item => (
                <EventItem 
                  key={item.id} 
                  item={item} 
                  onItemClick={onItemClick}
                  showPastEvents={showPastEvents}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No events found for the selected filter
        </div>
      )}
    </div>
  );
}
