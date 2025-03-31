
import { format, parseISO, isPast, isToday, isSameDay } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { groupEventsByDay } from "./utils";
import { EventItem } from "./EventItem";

interface EventGroupsProps {
  filteredItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
}

export function EventGroups({ filteredItems, onItemClick }: EventGroupsProps) {
  // Group events by day
  const groupedEvents = groupEventsByDay(filteredItems);
  
  return (
    <div className="space-y-4">
      {groupedEvents.map((group, groupIndex) => (
        <div key={group.date.toString()} className="space-y-2">
          {/* Date header */}
          <h3 className="text-sm font-medium pt-2 pb-1 border-b">
            {format(group.date, "EEEE, MMMM d, yyyy")}
          </h3>
          
          {/* Events for this day */}
          <div className="space-y-2">
            {group.items.map(item => (
              <EventItem 
                key={item.id} 
                item={item} 
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
