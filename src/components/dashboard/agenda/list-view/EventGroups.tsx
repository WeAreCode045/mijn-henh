
import { format, isToday, parseISO, isPast, isSameDay } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { EventItem } from "./EventItem";
import { groupEventsByDay } from "./utils";

interface EventGroupsProps {
  filteredItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  showPastEvents: boolean;
}

export function EventGroups({ filteredItems, onItemClick, showPastEvents }: EventGroupsProps) {
  // Sort and group events by day
  const groupedEvents = groupEventsByDay(filteredItems);
  
  return (
    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
      {groupedEvents.map((group, groupIndex) => {
        const isPastGroup = isPast(group.date) && !isToday(group.date);
        
        // Skip rendering the entire group if it's a past group and we're not showing past events
        if (isPastGroup && !showPastEvents) {
          return null;
        }

        // Only show headers for upcoming events or today, or when specifically showing past events
        const showHeader = !isPastGroup || isToday(group.date) || showPastEvents;

        return (
          <div key={group.date.toString()} className="space-y-2">
            {/* Date header - only show for future events or today, or if explicitly showing past events */}
            {showHeader && 
              (groupIndex === 0 || !isSameDay(group.date, groupedEvents[groupIndex - 1]?.date)) && (
                <h3 className="text-sm font-medium pt-2 pb-1 border-b">
                  {format(group.date, "EEEE, MMMM d, yyyy")}
                </h3>
            )}
            
            {/* Events list */}
            {group.items.map((item) => (
              <EventItem 
                key={item.id}
                item={item}
                onItemClick={onItemClick}
                showPastEvents={showPastEvents}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
