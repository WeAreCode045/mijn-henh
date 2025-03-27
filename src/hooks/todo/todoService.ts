
import { supabase } from "@/integrations/supabase/client";
import { TodoItem, TodoItemInput, TodoItemUpdate } from "./types";

// Helper to ensure date is always a string when saving to DB
const formatDateForDB = (date: string | Date | undefined): string | undefined => {
  if (!date) return undefined;
  return typeof date === 'string' ? date : date.toISOString();
};

// Fetch all todo items for a user
export const fetchTodoItems = async (userId: string): Promise<TodoItem[]> => {
  const { data, error } = await supabase
    .from("todo_items")
    .select("*")
    .or(`assigned_to_id.eq.${userId},created_by.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todo items:", error);
    throw error;
  }

  return data || [];
};

// Create a new todo item
export const createTodoItem = async (todoData: TodoItemInput): Promise<TodoItem | undefined> => {
  // Format dates to strings for database
  const formattedData = {
    ...todoData,
    due_date: formatDateForDB(todoData.due_date)
  };

  const { data, error } = await supabase
    .from("todo_items")
    .insert(formattedData)
    .select()
    .single();

  if (error) {
    console.error("Error creating todo item:", error);
    throw error;
  }

  return data;
};

// Update an existing todo item
export const updateTodoItem = async (id: string, todoData: TodoItemUpdate): Promise<void> => {
  // Format dates to strings for database
  const formattedData = {
    ...todoData,
    due_date: formatDateForDB(todoData.due_date)
  };

  const { error } = await supabase
    .from("todo_items")
    .update(formattedData)
    .eq("id", id);

  if (error) {
    console.error("Error updating todo item:", error);
    throw error;
  }
};

// Delete a todo item
export const deleteTodoItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("todo_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting todo item:", error);
    throw error;
  }
};

// Update multiple todo items at once (used for reordering)
export const batchUpdateTodoItems = async (items: TodoItem[]): Promise<void> => {
  // This would need to be implemented if batch updates are needed
  // Supabase doesn't have a direct batch update, so we might need 
  // to use transactions or multiple calls
  for (const item of items) {
    await supabase
      .from("todo_items")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);
  }
};
