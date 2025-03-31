
import { format, isToday, parseISO, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, Home } from "lucide-react";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";

interface EventItemProps {
  item: AgendaItem;
  onItemClick: (item: AgendaItem) => void;
  showPastEvents: boolean;
}

export function EventItem({ item, onItemClick, showPastEvents }: EventItemProps) {
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
          <div className="flex flex-col items-center justify-center min-w-[48px] h-12 bg-accent rounded-md">
            <span className="text-base font-medium">{format(eventDate, "dd")}</span>
            <span className="text-xs">{format(eventDate, "MMM")}</span>
          </div>
          
          <div className="space-y-1 flex-1">
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
}
