
import { format, parseISO, isPast, isToday, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AgendaItem } from "./types";
import { CalendarDays, MapPin, History, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AgendaItemListProps {
  filteredAgendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
  groupedEvents?: { date: Date; items: AgendaItem[] }[];
}

export function AgendaItemList({ 
  filteredAgendaItems, 
  isLoading, 
  onItemClick,
  groupedEvents
}: AgendaItemListProps) {
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  // Filter based on past event toggle
  const displayItems = filteredAgendaItems.filter(item => {
    if (!item.event_date) return true; // Keep items without a date
    
    const eventDate = parseISO(item.event_date);
    if (showPastEvents) {
      return true; // Show all events when toggle is on
    } else {
      return isToday(eventDate) || !isPast(eventDate); // Keep today's and future items by default
    }
  });

  if (displayItems.length === 0) {
    return (
      <>
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowPastEvents(!showPastEvents)}
          >
            <History className="h-4 w-4" />
            {showPastEvents ? "Hide past events" : "Show past events"}
          </Button>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          {showPastEvents 
            ? "No agenda items found for the selected period."
            : "No upcoming events. Try showing past events."}
        </div>
      </>
    );
  }

  // If we have grouped events, display them by day
  if (groupedEvents && groupedEvents.length > 0) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowPastEvents(!showPastEvents)}
          >
            <History className="h-4 w-4" />
            {showPastEvents ? "Hide past events" : "Show past events"}
          </Button>
        </div>
        
        {groupedEvents.map((group, groupIndex) => (
          <div key={group.date.toString()} className="space-y-2">
            {/* Date header */}
            {(groupIndex === 0 || !isSameDay(group.date, groupedEvents[groupIndex - 1].date)) && (
              <h3 className="text-sm font-medium pt-2 pb-1 border-b">
                {format(group.date, "EEEE, MMMM d, yyyy")}
              </h3>
            )}
            
            {/* Events for this day */}
            {group.items
              .filter(item => {
                if (!item.event_date) return true;
                const eventDate = parseISO(item.event_date);
                return showPastEvents || isToday(eventDate) || !isPast(eventDate);
              })
              .map(item => {
                const eventDate = parseISO(item.event_date);
                const isPastEvent = isPast(eventDate) && !isToday(eventDate);
                
                return (
                  <div 
                    key={item.id} 
                    className={`border rounded-md p-3 hover:bg-accent cursor-pointer transition-colors ${isPastEvent ? 'opacity-70' : ''}`}
                    onClick={() => onItemClick(item)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex flex-col items-center justify-center min-w-[48px] h-12 bg-accent rounded-md">
                        <span className="text-base font-medium">{format(eventDate, "dd")}</span>
                        <span className="text-xs">{format(eventDate, "MMM")}</span>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {isPastEvent && showPastEvents && (
                              <Badge variant="outline" className="ml-2 text-xs">Past</Badge>
                            )}
                            <Badge variant="outline" className="ml-2">
                              {item.event_time}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{item.event_time}</span>
                          
                          {item.property && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[150px]">{item.property.title}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    );
  }

  // If no grouping provided, fall back to the original list view
  return (
    <div className="space-y-2">
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setShowPastEvents(!showPastEvents)}
        >
          <History className="h-4 w-4" />
          {showPastEvents ? "Hide past events" : "Show past events"}
        </Button>
      </div>
      
      {displayItems.map((item) => {
        const eventDate = parseISO(item.event_date);
        const formattedDate = format(eventDate, "MMM d, yyyy");
        const isPastEvent = isPast(eventDate) && !isToday(eventDate);
        
        return (
          <div 
            key={item.id} 
            className={`border rounded-md p-3 hover:bg-accent cursor-pointer transition-colors ${isPastEvent ? 'opacity-70' : ''}`}
            onClick={() => onItemClick(item)}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isPastEvent && showPastEvents && (
                  <Badge variant="outline" className="ml-2 text-xs">Past</Badge>
                )}
                <Badge variant="outline" className="ml-2">
                  {item.event_time}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
              
              {item.property && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[150px]">{item.property.title}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
