
import { format, isToday, parseISO } from "date-fns";
import { CalendarIcon, Clock, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

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

  // Sort by date and time
  const sortedItems = [...agendaItems].sort((a, b) => {
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
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {sortedItems.map((item) => {
        try {
          const eventDate = parseISO(item.event_date);
          const isCurrentDay = isToday(eventDate);
          
          return (
            <div 
              key={item.id} 
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
  );
}
