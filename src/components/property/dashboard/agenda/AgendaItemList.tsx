import { format, parseISO, isPast, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AgendaItem } from "./types";
import { CalendarDays, MapPin } from "lucide-react";

interface AgendaItemListProps {
  filteredAgendaItems: AgendaItem[];
  isLoading: boolean;
  onItemClick: (item: AgendaItem) => void;
}

export function AgendaItemList({ 
  filteredAgendaItems, 
  isLoading, 
  onItemClick 
}: AgendaItemListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const currentAndFutureItems = filteredAgendaItems.filter(item => {
    if (!item.event_date) return true; // Keep items without a date
    
    const eventDate = parseISO(item.event_date);
    return isToday(eventDate) || !isPast(eventDate); // Keep today's and future items
  });

  if (currentAndFutureItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No agenda items found for the selected period.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {currentAndFutureItems.map((item) => {
        const eventDate = parseISO(item.event_date);
        const formattedDate = format(eventDate, "MMM d, yyyy");
        
        return (
          <div 
            key={item.id} 
            className="border rounded-md p-3 hover:bg-accent cursor-pointer transition-colors"
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
              <Badge variant="outline" className="ml-2">
                {item.event_time}
              </Badge>
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
