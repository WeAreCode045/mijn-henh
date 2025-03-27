
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TodoDialog } from "./todo/TodoDialog";
import { useTodoItems } from "@/hooks/useTodoItems";
import { TodoItem } from "@/types/todo";
import { TodoHeader } from "./todo/TodoHeader";
import { TodoList } from "./todo/TodoList";
import { TodoDeleteDialog } from "./todo/TodoDeleteDialog";
import { TodoNotification } from "./todo/TodoNotification";

export function TodoSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTodoItem, setSelectedTodoItem] = useState<TodoItem | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const itemToDeleteRef = useRef<string | null>(null);
  
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

  return (
    <Card>
      <CardHeader>
        <TodoHeader 
          showCompleted={showCompleted}
          onToggleShowCompleted={setShowCompleted}
          onAddClick={handleAddClick}
        />
      </CardHeader>
      <CardContent>
        <TodoList 
          items={filteredItems}
          isLoading={isLoading}
          showCompleted={showCompleted}
          onToggleComplete={handleToggleComplete}
          onEditItem={handleEditItem}
          onDeleteClick={handleDeleteClick}
          onUpdateOrder={updateTodoOrder}
        />
      </CardContent>

      <TodoDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveTodoItem}
        item={selectedTodoItem}
        mode={selectedTodoItem ? "edit" : "add"}
      />
      
      <TodoDeleteDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />

      <TodoNotification 
        todoItems={todoItems}
        updateTodoItem={updateTodoItem}
      />
    </Card>
  );
}
