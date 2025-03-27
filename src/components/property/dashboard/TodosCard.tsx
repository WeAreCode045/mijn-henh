
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2, CircleDashed } from "lucide-react";
import { TodoDialog } from "@/components/dashboard/todo/TodoDialog";
import { useTodoItems } from "@/hooks/useTodoItems";
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TodoItem } from "@/types/todo";
import { useParams } from "react-router-dom";

export function TodosCard() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTodoItem, setSelectedTodoItem] = useState<TodoItem | undefined>(undefined);
  
  const { 
    todoItems, 
    isLoading, 
    addTodoItem, 
    updateTodoItem, 
    markTodoItemComplete
  } = useTodoItems(propertyId);

  const handleAddClick = () => {
    setSelectedTodoItem(undefined);
    setDialogOpen(true);
  };
  
  const handleEditItem = (item: TodoItem) => {
    setSelectedTodoItem(item);
    setDialogOpen(true);
  };
  
  const handleToggleComplete = async (item: TodoItem) => {
    await markTodoItemComplete(item.id, !item.completed);
  };
  
  const handleSaveTodoItem = async (data: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    // Always set the property_id to current property
    const todoData = {
      ...data,
      property_id: propertyId || null
    };
    
    if (selectedTodoItem) {
      await updateTodoItem(selectedTodoItem.id, todoData);
    } else {
      await addTodoItem(todoData);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Property Tasks</CardTitle>
        <Button onClick={handleAddClick} size="sm" className="h-8 px-2">
          <PlusCircle className="h-4 w-4 mr-1" />
          <span>Add Task</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : todoItems.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No tasks for this property
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {todoItems.map((item) => (
              <div 
                key={item.id} 
                className={`border rounded-md p-2 text-sm hover:bg-muted/50 cursor-pointer transition-colors ${
                  item.completed ? "opacity-70" : ""
                } ${
                  !item.completed && item.due_date && isPast(new Date(item.due_date)) 
                    ? "border-red-200 bg-red-50 dark:bg-red-950/20" 
                    : ""
                }`}
                onClick={() => handleEditItem(item)}
              >
                <div className="flex items-start gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(item);
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <CircleDashed className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex flex-col">
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
                            !item.completed && isPast(new Date(item.due_date)) 
                              ? "text-red-500 border-red-300" 
                              : ""
                          }`}
                        >
                          Due: {format(new Date(item.due_date), "MMM d")}
                        </Badge>
                      )}
                      {item.assigned_to && (
                        <Badge variant="secondary" className="text-xs">
                          {item.assigned_to.full_name}
                        </Badge>
                      )}
                    </div>
                  </div>
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
    </Card>
  );
}
