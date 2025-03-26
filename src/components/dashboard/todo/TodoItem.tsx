
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isToday } from "date-fns";
import { TodoItem as TodoItemType } from "@/types/todo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CircleDashed, 
  CheckCircle2, 
  Calendar, 
  CalendarClock, 
  User, 
  Home,
  MoreHorizontal, 
  Edit, 
  Check, 
  Trash2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TodoItemProps {
  item: TodoItemType;
  index: number;
  onToggleComplete: (item: TodoItemType) => void;
  onEditItem: (item: TodoItemType) => void;
  onDeleteClick: (id: string) => void;
  onDragStart: (position: number) => void;
  onDragEnter: (position: number) => void;
  onDragEnd: () => void;
}

export function TodoItem({
  item,
  index,
  onToggleComplete,
  onEditItem,
  onDeleteClick,
  onDragStart,
  onDragEnter,
  onDragEnd
}: TodoItemProps) {
  const navigate = useNavigate();
  
  const navigateToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}/dashboard`);
  };

  const isPastDue = !item.completed && 
    item.due_date && 
    isPast(new Date(item.due_date)) && 
    !isToday(new Date(item.due_date));

  return (
    <div 
      className={`border rounded-md p-2 text-sm hover:bg-muted/50 cursor-grab transition-colors ${
        item.completed ? "opacity-70" : ""
      } ${
        isPastDue ? "border-red-200 bg-red-50 dark:bg-red-950/20" : ""
      }`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-full mt-0.5 flex-shrink-0"
          onClick={() => onToggleComplete(item)}
        >
          {item.completed ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <CircleDashed className="h-4 w-4" />
          )}
        </Button>
        <div className="flex flex-col flex-grow">
          <span className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
            {item.title}
          </span>
          {item.description && (
            <p className={`text-xs ${item.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
              {item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-1">
            {item.due_date && (
              <Badge 
                variant="outline" 
                className={`text-xs flex items-center gap-1 ${
                  isPastDue ? "text-red-500 border-red-300" : ""
                }`}
              >
                <Calendar className="h-3 w-3" />
                {isToday(new Date(item.due_date)) 
                  ? "Today" 
                  : format(new Date(item.due_date), "MMM d")}
              </Badge>
            )}
            {item.notify_at && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <CalendarClock className="h-3 w-3" />
                {format(new Date(item.notify_at), "MMM d, HH:mm")}
              </Badge>
            )}
            {item.assigned_to && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.assigned_to.full_name}
              </Badge>
            )}
            {item.property && (
              <Badge 
                variant="secondary" 
                className="text-xs flex items-center gap-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToProperty(item.property!.id);
                }}
              >
                <Home className="h-3 w-3" />
                {item.property.title.length > 20 
                  ? `${item.property.title.substring(0, 20)}...` 
                  : item.property.title}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditItem(item)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleComplete(item)}
              className="gap-2"
            >
              {item.completed ? (
                <>
                  <CircleDashed className="h-4 w-4" />
                  Mark as incomplete
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Mark as complete
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDeleteClick(item.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
