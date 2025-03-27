
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTodoItems } from "@/hooks/useTodoItems";
import { TodoList } from "./todo/TodoList";
import { useState } from "react";
import { TodoItem } from "@/types/todo";

interface TodoSectionProps {
  fullWidth?: boolean;
}

export function TodoSection({ fullWidth = false }: TodoSectionProps) {
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
  
  const handleToggleComplete = (item: TodoItem) => {
    markTodoItemComplete(item.id, !item.completed);
  };

  const handleEditItem = (item: TodoItem) => {
    // This would typically open an edit dialog
    console.log("Edit item:", item);
  };
  
  return (
    <Card className={fullWidth ? "w-full" : ""}>
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <CardTitle>Todo Items</CardTitle>
        <Button 
          size="sm" 
          onClick={() => {
            // Open add todo dialog
          }}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Todo
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        <TodoList 
          items={todoItems || []}
          isLoading={isLoading}
          showCompleted={showCompleted}
          onToggleComplete={handleToggleComplete}
          onEditItem={handleEditItem}
          onDeleteClick={deleteTodoItem}
          onUpdateOrder={updateTodoOrder}
        />
      </CardContent>
    </Card>
  );
}
