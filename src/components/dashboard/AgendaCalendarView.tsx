
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { AgendaItem } from "@/hooks/useAgenda";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AgendaCalendarViewProps {
  agendaItems: AgendaItem[];
}

export function AgendaCalendarView({ agendaItems }: AgendaCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const navigate = useNavigate();

  // Get agenda items for the selected date
  const getAgendaItemsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return agendaItems.filter(item => {
      const itemDate = parseISO(item.event_date);
      return isSameDay(itemDate, date);
    }).sort((a, b) => a.event_time.localeCompare(b.event_time));
  };

  const selectedDateItems = getAgendaItemsForDate(selectedDate);

  // Function to render the day cell content (to show indicators for days with agenda items)
  const renderDayContent = (day: Date) => {
    const hasItems = agendaItems.some(item => isSameDay(parseISO(item.event_date), day));

    if (hasItems) {
      return (
        <div className="relative h-full w-full">
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="h-1 w-1 rounded-full bg-primary"></div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const itemsForDay = getAgendaItemsForDate(date);
      if (itemsForDay.length > 0) {
        setShowDetailsDialog(true);
      }
    }
  };

  const navigateToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}/dashboard`);
    setShowDetailsDialog(false);
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border"
        components={{
          DayContent: ({ date }: { date: Date }) => (
            <>
              {date.getDate()}
              {renderDayContent(date)}
            </>
          )
        }}
      />

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : 'Agenda Items'}
            </DialogTitle>
            <DialogDescription>
              Agenda items scheduled for this date
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4 max-h-[300px] overflow-y-auto pr-2">
            {selectedDateItems.map((item) => (
              <div key={item.id} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{item.event_time.substring(0, 5)}</span>
                    </div>
                  </div>
                  
                  {item.property && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => navigateToProperty(item.property!.id)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <span className="text-xs">{item.property.title}</span>
                    </Button>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
                
                {item.property && (
                  <Badge variant="outline" className="text-xs">
                    Property: {item.property.title}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
