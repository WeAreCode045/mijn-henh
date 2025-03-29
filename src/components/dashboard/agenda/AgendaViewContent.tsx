<<<<<<< Updated upstream

import { Filter } from "lucide-react";
=======
import { Calendar as CalendarIcon, Filter } from "lucide-react";
>>>>>>> Stashed changes
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { EmptyAgendaNotification } from "./EmptyAgendaNotification";
import { AgendaCalendarView } from "../AgendaCalendarView";
import { AgendaListView } from "../AgendaListView";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgendaViewContentProps {
  view: "calendar" | "list";
  safeAgendaItems: AgendaItem[];
  isLoading: boolean;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filteredAgendaItems: AgendaItem[];
  onItemClick: (item: AgendaItem) => void;
  onAddClick: () => void;
}

export function AgendaViewContent({
  view,
  safeAgendaItems,
  isLoading,
  dateRange,
  setDateRange,
  filteredAgendaItems,
  onItemClick,
  onAddClick,
}: AgendaViewContentProps) {
  // Make sure we always have an array, even if filteredAgendaItems is undefined
  const itemsToDisplay = filteredAgendaItems || [];
  
  // Always check if safeAgendaItems exists before checking its length
  const hasItems = safeAgendaItems && safeAgendaItems.length > 0;
  console.log("AgendaViewContent - hasItems:", hasItems);
  
<<<<<<< Updated upstream
=======
  // Add console logs to debug the agenda items
  console.log("Parent Component - safeAgendaItems:", safeAgendaItems);
  console.log("Parent Component - filteredAgendaItems:", filteredAgendaItems);
  console.log("AgendaViewContent - view:", view);
  console.log("AgendaViewContent - safeAgendaItems:", safeAgendaItems);
  console.log("AgendaViewContent - filteredAgendaItems:", filteredAgendaItems);console.log("AgendaViewContent - itemsToDisplay:", itemsToDisplay);
  
>>>>>>> Stashed changes
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setDateRange(undefined)}>
          <Filter className="h-4 w-4" />
          {dateRange ? "Clear Filter" : "All Events"}
        </Button>
      </div>
      
      {isLoading ? (
        // Loading spinner
        <div>Loading...</div>
      ) : !hasItems ? (
        // Empty agenda notification
        <EmptyAgendaNotification onAddClick={onAddClick} />
      ) : view === "calendar" ? (
<<<<<<< Updated upstream
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <AgendaCalendarView 
                  agendaItems={itemsToDisplay}
                  isLoading={false}
                  onItemClick={onItemClick}
                  compactMode={true}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <AgendaListView 
                  agendaItems={itemsToDisplay}
                  isLoading={false}
                  onItemClick={onItemClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {itemsToDisplay.map(item => (
            <Card key={item.id} className="cursor-pointer hover:bg-accent/5" onClick={() => onItemClick(item)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center min-w-[40px] h-10 bg-accent rounded-md">
                    <span className="text-xs font-medium">{new Date(item.event_date).getDate()}</span>
                    <span className="text-xs">{new Date(item.event_date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="mr-2">{item.event_time}</span>
                      {item.property && (
                        <span className="truncate max-w-[150px]">{item.property.title}</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
=======
        <>
          <AgendaCalendarView agendaItems={itemsToDisplay} isLoading={isLoading} onItemClick={onItemClick} />
          {console.log("AgendaCalendarView - agendaItems:", itemsToDisplay)}
        </>
      ) : (
        <>
          <AgendaListView agendaItems={itemsToDisplay} isLoading={isLoading} onItemClick={onItemClick} />
          {console.log("AgendaListView - agendaItems:", itemsToDisplay)}
        </>
>>>>>>> Stashed changes
      )}
    </div>
  );
}

