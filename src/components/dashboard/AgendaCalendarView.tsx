
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { AgendaItem } from "@/hooks/useAgenda";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgendaCalendarViewProps {
  agendaItems: AgendaItem[];
}

export function AgendaCalendarView({ agendaItems }: AgendaCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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
  };

  const navigateToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}/dashboard`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left side: Selected date agenda items */}
      <div>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
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
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Right side: Calendar */}
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
      </div>
    </div>
  );
