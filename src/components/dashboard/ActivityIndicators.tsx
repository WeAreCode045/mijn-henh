
import { useState } from "react";
import { Mail, Calendar, CheckSquare, Bell } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAgenda } from "@/hooks/useAgenda";
import { useTodoItems } from "@/hooks/useTodoItems";
import { isToday, parseISO } from "date-fns";

export function ActivityIndicators() {
  // Mock data - in a real app, you would fetch these from a backend
  const [unreadEmails, setUnreadEmails] = useState(3);
  const [notifications, setNotifications] = useState(5);
  
  // Get actual todo items
  const { todoItems } = useTodoItems();
  const { agendaItems } = useAgenda();
  
  // Calculate items due today
  const todayTodos = todoItems.filter(todo => 
    !todo.completed && todo.due_date && isToday(parseISO(todo.due_date))
  ).length;
  
  // Calculate agenda items for today
  const todayAgendaItems = agendaItems.filter(item => 
    item.event_date && isToday(parseISO(item.event_date))
  ).length;

  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Mail className="h-5 w-5" />
              {unreadEmails > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadEmails}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{unreadEmails} unread messages</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Calendar className="h-5 w-5" />
              {todayAgendaItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {todayAgendaItems}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{todayAgendaItems} agenda items today</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <CheckSquare className="h-5 w-5" />
              {todayTodos > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {todayTodos}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{todayTodos} todo items due today</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {notifications}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{notifications} new notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
