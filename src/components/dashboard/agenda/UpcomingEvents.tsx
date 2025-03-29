
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AgendaItem } from "@/components/property/dashboard/agenda/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export function UpcomingEvents({ limit = 5, propertyId = null, className = "" }) {
  const navigate = useNavigate();
  
  const fetchAgendaItems = async () => {
    let query = supabase
      .from("property_agenda_items")
      .select(`
        *,
        property:property_id(id, title)
      `)
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true })
      .gte("event_date", new Date().toISOString().split("T")[0]);
      
    if (propertyId) {
      query = query.eq("property_id", propertyId);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) throw error;
    return data as AgendaItem[];
  };
  
  const { data: events, isLoading } = useQuery({
    queryKey: ["upcoming-events", propertyId, limit],
    queryFn: fetchAgendaItems
  });
  
  const handleViewAllClick = () => {
    navigate("/agenda");
  };
  
  const handleEventClick = (event: AgendaItem) => {
    if (event.property_id) {
      navigate(`/property/${event.property_id}/agenda/${event.id}`);
    } else {
      navigate(`/agenda/${event.id}`);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CalendarDays className="mr-2 h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="mb-3 pb-3 border-b last:border-b-0">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-2/5 mb-1" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Upcoming Events
        </CardTitle>
        <Button 
          variant="link" 
          className="text-sm p-0 h-auto"
          onClick={handleViewAllClick}
        >
          View All <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="pb-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <h4 className="font-medium text-sm">{event.title}</h4>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(new Date(event.event_date), "MMM d, yyyy")}
                  <span className="mx-1">•</span>
                  <Clock className="mr-1 h-3 w-3" />
                  {event.event_time.substring(0, 5)}
                  {event.end_time && ` - ${event.end_time.substring(0, 5)}`}
                </div>
                {event.property && (
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    {event.property.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No upcoming events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Add missing import for Calendar icon
import { Calendar } from "lucide-react";
