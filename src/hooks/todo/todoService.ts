
import { supabase } from "@/integrations/supabase/client";
import { TodoItem, TodoItemInput, TodoItemUpdate } from "./types";

// Formats date objects to ISO strings for Supabase
export const formatTodoItemDates = <T extends { due_date?: Date | string | null; notify_at?: Date | string | null }>(
  item: T
): Omit<T, 'due_date' | 'notify_at'> & { due_date?: string | null; notify_at?: string | null } => {
  return {
    ...item,
    due_date: item.due_date instanceof Date ? item.due_date.toISOString() : item.due_date,
    notify_at: item.notify_at instanceof Date ? item.notify_at.toISOString() : item.notify_at
  };
};

// Fetch todo items
export const fetchTodoItems = async (propertyId?: string): Promise<TodoItem[]> => {
  let query = supabase
    .from('todo_items')
    .select(`
      *,
      property:properties(id, title),
      assigned_to:profiles(id, full_name)
    `);

  if (propertyId) {
    query = query.eq('property_id', propertyId);
  }
  
  query = query.order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

// Add a new todo item
export const addTodoItem = async (todoItem: TodoItemInput): Promise<TodoItem> => {
  // Format dates for Supabase
  const formattedItem = formatTodoItemDates(todoItem);
  
  // Insert a single item, not an array
  const { data, error } = await supabase
    .from('todo_items')
    .insert(formattedItem)
    .select();
  
  if (error) throw error;
  
  if (!data || data.length === 0) {
    throw new Error('No data returned after insert');
  }
  
  return data[0];
};

// Update an existing todo item
export const updateTodoItem = async (id: string, todoItem: TodoItemUpdate): Promise<void> => {
  // Convert Date objects to ISO strings for Supabase
  const formattedItem = formatTodoItemDates(todoItem);
  
  const { error } = await supabase
    .from('todo_items')
    .update(formattedItem)
    .eq('id', id);
  
  if (error) throw error;
};

// Update the order of todo items
export const updateTodoOrder = async (updates: { id: string, sort_order: number }[]): Promise<void> => {
  // Update each item one by one
  for (const update of updates) {
    const { error } = await supabase
      .from('todo_items')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id);
    
    if (error) throw error;
  }
};

// Delete a todo item
export const deleteTodoItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('todo_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
