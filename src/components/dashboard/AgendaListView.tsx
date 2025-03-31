
import { format, isToday, parseISO, isPast } from "date-fns";
import { CalendarIcon, Clock, Home, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AgendaListViewProps {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaListView({ 
  agendaItems, 
  isLoading,
  onItemClick
}: AgendaListViewProps) {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [filterValue, setFilterValue] = useState<string | undefined>(undefined);
  
  // Add some debug logs
  console.log("AgendaListView - agendaItems:", agendaItems);
  console.log("AgendaListView - isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!agendaItems || agendaItems.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No upcoming events scheduled
      </div>
    );
  }

  // Filter items based on show past events toggle
  const filteredByPast = agendaItems.filter(item => {
    if (!item.event_date) return true;
    const eventDate = parseISO(item.event_date);
    
    if (showPastEvents) {
      return true; // Show all events
    } else {
      return isToday(eventDate) || !isPast(eventDate); // Show only today and future events
    }
  });
  
  // Apply time filter (day, week, month)
  const filteredItems = filterValue ? filterByTimeRange(filteredByPast, filterValue) : filteredByPast;

  if (filteredItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowPastEvents(!showPastEvents)}
            >
              <History className="h-4 w-4" />
              {showPastEvents ? "Hide past events" : "Show past events"}
            </Button>
            
            <ToggleGroup type="single" value={filterValue} onValueChange={setFilterValue}>
              <ToggleGroupItem value="day" size="sm">Day</ToggleGroupItem>
              <ToggleGroupItem value="week" size="sm">Week</ToggleGroupItem>
              <ToggleGroupItem value="month" size="sm">Month</ToggleGroupItem>
            </ToggleGroup>
            
            {filterValue && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFilterValue(undefined)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-center py-6 text-muted-foreground">
          No events found for the selected filters
        </div>
      </div>
    );
  }

  // Sort by date and time
  const sortedItems = [...filteredItems].sort((a, b) => {
    try {
      if (!a.event_date || !b.event_date) return 0;
      
      const dateA = new Date(`${a.event_date}T${a.event_time || '00:00:00'}`);
      const dateB = new Date(`${b.event_date}T${b.event_time || '00:00:00'}`);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.error("Error sorting dates:", error);
      return 0;
    }
  });

  console.log("AgendaListView - sortedItems:", sortedItems);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowPastEvents(!showPastEvents)}
          >
            <History className="h-4 w-4" />
            {showPastEvents ? "Hide past events" : "Show past events"}
          </Button>
          
          <ToggleGroup type="single" value={filterValue} onValueChange={setFilterValue}>
            <ToggleGroupItem value="day" size="sm">Day</ToggleGroupItem>
            <ToggleGroupItem value="week" size="sm">Week</ToggleGroupItem>
            <ToggleGroupItem value="month" size="sm">Month</ToggleGroupItem>
          </ToggleGroup>
          
          {filterValue && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilterValue(undefined)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {sortedItems.map((item) => {
          try {
            const eventDate = parseISO(item.event_date);
            const isCurrentDay = isToday(eventDate);
            const isPastEvent = isPast(eventDate) && !isCurrentDay;
            
            return (
              <div 
                key={item.id} 
                className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${isPastEvent ? 'opacity-70' : ''}`}
                onClick={() => onItemClick(item)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center justify-center min-w-[40px] h-10 bg-accent rounded-md">
                    <span className="text-xs font-medium">{format(eventDate, "dd")}</span>
                    <span className="text-xs">{format(eventDate, "MMM")}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{item.title}</h4>
                      {isCurrentDay && (
                        <Badge variant="outline" className="ml-2 text-xs bg-primary/10">Today</Badge>
                      )}
                      {isPastEvent && showPastEvents && (
                        <Badge variant="outline" className="ml-2 text-xs bg-muted/30">Past</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.event_time?.substring(0, 5) || "00:00"}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{format(eventDate, "EEEE, MMM d")}</span>
                      </div>
                      
                      {item.property && (
                        <div className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          <span className="truncate max-w-[100px]">{item.property.title}</span>
                        </div>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          } catch (error) {
            console.error("Error rendering item:", error, item);
            return null;
          }
        }).filter(Boolean)}
      </div>
    </div>
  );
}

// Helper function to filter events based on time range
function filterByTimeRange(items: AgendaItem[], range: string): AgendaItem[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return items.filter(item => {
    if (!item.event_date) return false;
    
    const eventDate = parseISO(item.event_date);
    
    switch (range) {
      case 'day':
        return isToday(eventDate);
      case 'week': {
        // Calculate start of week (Sunday) and end of week (Saturday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Go to Saturday
        
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
      case 'month': {
        // Check if in current month
        return eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear();
      }
      default:
        return true;
    }
  });
}
