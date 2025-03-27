
import { TodoItem as BaseTodoItem } from "@/types/todo";

// Re-export the TodoItem type
export type TodoItem = BaseTodoItem;

// Type for creating or updating a todo item - ensure due_date is string only
export type TodoItemInput = Omit<TodoItem, "id" | "created_at" | "updated_at"> & {
  due_date?: string; // Make sure this is string only, not Date
};

// Type for partial updates to a todo item
export type TodoItemUpdate = Partial<TodoItemInput>;

// Return type for the useTodoItems hook
export interface UseTodoItemsReturn {
  todoItems: TodoItem[];
  isLoading: boolean;
  error: unknown;
  addTodoItem: (todoData: TodoItemInput) => Promise<TodoItem | undefined>;
  updateTodoItem: (id: string, todoData: TodoItemUpdate) => Promise<void>;
  markTodoItemComplete: (id: string, completed: boolean) => Promise<void>;
  deleteTodoItem: (id: string) => Promise<void>;
  updateTodoOrder: (items: TodoItem[]) => Promise<void>;
}
