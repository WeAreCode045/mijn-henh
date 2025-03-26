
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ClipboardList, Plus, Calendar, Check, CheckCircle2, CircleDashed, CalendarClock, Edit, Trash2, User, Home } from "lucide-react";
import { TodoDialog } from "./TodoDialog";
import { useTodoItems } from "@/hooks/useTodoItems";
import { TodoItem } from "@/types/todo";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isPast, isToday } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export function TodoSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTodoItem, setSelectedTodoItem] = useState<TodoItem | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const itemToDeleteRef = useRef<string | null>(null);
  const navigate = useNavigate();
  
  const { 
    todoItems, 
    isLoading, 
    showCompleted, 
    setShowCompleted,
    addTodoItem, 
    updateTodoItem, 
    deleteTodoItem,
    markTodoItemComplete,
    updateTodoOrder
  } = useTodoItems();

  // Filter items based on completion status
  const filteredItems = showCompleted 
    ? todoItems 
    : todoItems.filter(item => !item.completed);

  const handleAddClick = () => {
    setSelectedTodoItem(undefined);
    setDialogOpen(true);
  };
  
  const handleEditItem = (item: TodoItem) => {
    setSelectedTodoItem(item);
    setDialogOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    itemToDeleteRef.current = id;
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (itemToDeleteRef.current) {
      await deleteTodoItem(itemToDeleteRef.current);
      itemToDeleteRef.current = null;
      setDeleteDialogOpen(false);
    }
  };
  
  const handleToggleComplete = async (item: TodoItem) => {
    await markTodoItemComplete(item.id, !item.completed);
  };
  
  const handleSaveTodoItem = async (data: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    if (selectedTodoItem) {
      await updateTodoItem(selectedTodoItem.id, data);
    } else {
      await addTodoItem(data);
    }
  };
  
  const navigateToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}/dashboard`);
  };

  // Set up drag and drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };
  
  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };
  
  const handleDragEnd = async () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const itemsCopy = [...filteredItems];
      const draggedItemContent = itemsCopy[dragItem.current];
      
      // Remove the item from its original position
      itemsCopy.splice(dragItem.current, 1);
      
      // Insert the item at the new position
      itemsCopy.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Update the backend with the new order
      await updateTodoOrder(itemsCopy);
      
      // Reset refs
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  // Set up desktop notifications
  useEffect(() => {
    // Request notification permission if not yet granted
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    // Set up notification check interval
    const checkNotifications = () => {
      todoItems.forEach(item => {
        if (
          item.notify_at &&
          !item.notification_sent &&
          !item.completed &&
          new Date(item.notify_at) <= new Date()
        ) {
          // Send notification
          if (Notification.permission === "granted") {
            const notification = new Notification("Task Reminder", {
              body: item.title,
              icon: "/favicon.ico"
            });
            
            // Mark notification as sent
            updateTodoItem(item.id, { notification_sent: true });
            
            // Close notification after 10 seconds
            setTimeout(() => notification.close(), 10000);
          }
        }
      });
    };
    
    // Check every minute
    const interval = setInterval(checkNotifications, 60000);
    
    // Initial check
    checkNotifications();
    
    return () => clearInterval(interval);
  }, [todoItems, updateTodoItem]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Tasks</span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor="show-completed" className="text-xs">Show completed</Label>
          </div>
          <Button onClick={handleAddClick} size="sm" className="h-8 px-2">
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Task</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2 p-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {showCompleted 
              ? "No tasks found" 
              : "No incomplete tasks. Add a new task or enable 'Show completed' to see completed tasks."}
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`border rounded-md p-2 text-sm hover:bg-muted/50 cursor-grab transition-colors ${
                  item.completed ? "opacity-70" : ""
                } ${
                  !item.completed && item.due_date && isPast(new Date(item.due_date)) && !isToday(new Date(item.due_date))
                    ? "border-red-200 bg-red-50 dark:bg-red-950/20" 
                    : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex items-start gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full mt-0.5 flex-shrink-0"
                    onClick={() => handleToggleComplete(item)}
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
                            !item.completed && isPast(new Date(item.due_date)) && !isToday(new Date(item.due_date))
                              ? "text-red-500 border-red-300" 
                              : ""
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
                      <DropdownMenuItem onClick={() => handleEditItem(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleComplete(item)}
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
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <TodoDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveTodoItem}
        item={selectedTodoItem}
        mode={selectedTodoItem ? "edit" : "add"}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
