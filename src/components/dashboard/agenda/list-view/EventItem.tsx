
import { format, parseISO, isPast, isToday } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, Home } from "lucide-react";

export interface EventItemProps {
  item: AgendaItem;
  onItemClick: (item: AgendaItem) => void;
  showPastEvents?: boolean;
}

export function EventItem({ item, onItemClick, showPastEvents = true }: EventItemProps) {
  if (!item.event_date) return null;
  
  const eventDate = parseISO(item.event_date);
  const isPastEvent = isPast(eventDate) && !isToday(eventDate);
  
  return (
    <div 
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
          {isPastEvent && (
            <Badge variant="outline" className="ml-2 text-xs">Past</Badge>
          )}
          <Badge variant="outline" className="ml-2">
            {item.event_time}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center mt-2 text-xs text-muted-foreground">
        <CalendarDays className="h-3 w-3 mr-1" />
        <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
        
        <span className="mx-2">•</span>
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
  );
}
