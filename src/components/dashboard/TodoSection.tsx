
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleDashed, PlusCircle, Calendar, ListFilter, Trash2, Edit } from "lucide-react";
import { useTodoItems } from "@/hooks/useTodoItems";
import { TodoDialog } from "./TodoDialog";
import { TodoItem } from "@/types/todo";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export function TodoSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedTodoItem, setSelectedTodoItem] = useState<TodoItem | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(true);
  
  const { 
    todoItems, 
    isLoading, 
    addTodoItem, 
    updateTodoItem, 
    deleteTodoItem, 
    markTodoItemComplete, 
    reorderTodoItems 
  } = useTodoItems();

  const handleAddClick = () => {
    setDialogMode("add");
    setSelectedTodoItem(undefined);
    setDialogOpen(true);
  };
  
  const handleEditItem = (item: TodoItem) => {
    setDialogMode("edit");
    setSelectedTodoItem(item);
    setDialogOpen(true);
  };
  
  const handleDeleteItem = async (itemId: string) => {
    await deleteTodoItem(itemId);
  };
  
  const handleToggleComplete = async (item: TodoItem) => {
    await markTodoItemComplete(item.id, !item.completed);
  };
  
  const handleSaveTodoItem = async (data: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    if (dialogMode === "add") {
      await addTodoItem(data);
    } else if (selectedTodoItem) {
      await updateTodoItem(selectedTodoItem.id, data);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    reorderTodoItems(startIndex, endIndex);
  };

  const filteredItems = todoItems.filter(item => showCompleted || !item.completed);

  return (
    <Card className="col-span-full md:col-span-1 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Todo List</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-completed" 
              checked={showCompleted} 
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor="show-completed" className="text-xs">Show completed</Label>
          </div>
          <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todo-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 max-h-[400px] overflow-y-auto pr-2"
                >
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No tasks available
                    </div>
                  ) : (
                    filteredItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border rounded-md p-3 transition-colors ${
                              item.completed ? "bg-muted/50" : ""
                            } ${
                              !item.completed && item.due_date && isPast(new Date(item.due_date)) 
                                ? "border-red-200 bg-red-50 dark:bg-red-950/20" 
                                : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex items-start gap-2 flex-grow">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full mt-0.5"
                                  onClick={() => handleToggleComplete(item)}
                                >
                                  {item.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <CircleDashed className="h-5 w-5" />
                                  )}
                                </Button>
                                <div className="flex flex-col">
                                  <span className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                                    {item.title}
                                  </span>
                                  {item.description && (
                                    <p className={`text-sm ${item.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {item.due_date && (
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs flex items-center gap-1 ${
                                          !item.completed && isPast(new Date(item.due_date)) 
                                            ? "border-red-500 text-red-500" 
                                            : ""
                                        }`}
                                      >
                                        <Calendar className="h-3 w-3" />
                                        {format(new Date(item.due_date), "MMM d, yyyy")}
                                      </Badge>
                                    )}
                                    {item.property && (
                                      <Badge variant="outline" className="text-xs">
                                        Property: {item.property.title}
                                      </Badge>
                                    )}
                                    {item.assigned_to && (
                                      <Badge variant="secondary" className="text-xs">
                                        Assigned: {item.assigned_to.full_name}
                                      </Badge>
                                    )}
                                    {item.notify_at && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                                        Notification: {format(new Date(item.notify_at), "MMM d, h:mm a")}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>

      <TodoDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveTodoItem}
        item={selectedTodoItem}
        mode={dialogMode}
      />
    </Card>
  );
}
