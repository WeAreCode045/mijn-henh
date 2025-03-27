import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTodoItems } from "@/hooks/useTodoItems";
import { TodoList } from "./todo/TodoList";

interface TodoSectionProps {
  fullWidth?: boolean;
}

export function TodoSection({ fullWidth = false }: TodoSectionProps) {
  const { todos, isLoading, addTodo, toggleTodo, editTodo, deleteTodo } = useTodoItems();
  
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
          todos={todos || []}
          isLoading={isLoading}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </CardContent>
    </Card>
  );
}
