
import { useState } from "react";
import { AgendaItem } from "@/hooks/useAgenda";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronDown, ChevronUp, ExternalLink, Trash2, Edit } from "lucide-react";
import { format, parseISO, startOfDay, addDays, isAfter, isBefore, isToday, isFuture } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AgendaListViewProps {
  agendaItems: AgendaItem[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (item: AgendaItem) => void;
}

export function AgendaListView({ agendaItems, onDelete, onEdit }: AgendaListViewProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('upcoming');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const today = startOfDay(new Date());
  const endOfUpcoming = addDays(today, 7); // 7 days from now
  
  const filteredItems = agendaItems.filter(item => {
    const itemDate = parseISO(item.event_date);
    
    switch(filter) {
      case 'today':
        return isToday(itemDate);
      case 'upcoming':
        return isFuture(itemDate) || isToday(itemDate);
      case 'past':
        return isBefore(itemDate, today);
      default:
        return true;
    }
  });

  // Group agenda items by date
  const groupedItems = filteredItems.reduce((acc, item) => {
    const date = item.event_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, AgendaItem[]>);

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedItems).sort();
  
  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (itemToDelete) {
      await onDelete(itemToDelete);
      setDeleteDialogOpen(false);
    }
  };

  const navigateToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}/dashboard`);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button 
          variant={filter === 'today' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('today')}
        >
          Today
        </Button>
        <Button 
          variant={filter === 'upcoming' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button 
          variant={filter === 'past' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('past')}
        >
          Past
        </Button>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>
      
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No agenda items found for the selected filter.
          </div>
        ) : (
          sortedDates.map(date => (
            <Collapsible key={date} defaultOpen={true} className="border rounded-md">
              <CollapsibleTrigger className="flex justify-between items-center w-full p-3 hover:bg-accent">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">
                    {format(parseISO(date), 'EEEE, MMMM do, yyyy')}
                  </span>
                  {isToday(parseISO(date)) && (
                    <Badge className="ml-2" variant="default">Today</Badge>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    {groupedItems[date].length} item{groupedItems[date].length !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown className="h-4 w-4 chevron-down" />
                  <ChevronUp className="h-4 w-4 chevron-up" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-3 space-y-3 border-t">
                  {groupedItems[date]
                    .sort((a, b) => a.event_time.localeCompare(b.event_time))
                    .map(item => (
                      <div key={item.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent/50">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-md">
                          <span className="text-xs font-medium">
                            {item.event_time.substring(0, 5)}
                          </span>
                          <Clock className="h-3 w-3 text-muted-foreground mt-1" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium">{item.title}</h4>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onEdit(item)}
                              >
                                <Edit className="h-3 w-3" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => confirmDelete(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                          
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                          
                          {item.property && (
                            <div className="mt-2 flex items-center">
                              <Badge variant="outline" className="text-xs">
                                Property: {item.property.title}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 ml-1 text-xs"
                                onClick={() => navigateToProperty(item.property!.id)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the agenda item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
