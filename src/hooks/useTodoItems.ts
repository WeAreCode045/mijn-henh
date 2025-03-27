
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { TodoItem } from "@/types/todo";

export type { TodoItem };

export function useTodoItems(propertyId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const fetchTodoItems = async (): Promise<TodoItem[]> => {
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
  
  const { data: todoItems = [], isLoading, error } = useQuery({
    queryKey: ['todoItems', propertyId],
    queryFn: fetchTodoItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const addTodoItem = async (todoItem: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    try {
      // Ensure date fields are converted to ISO strings for Supabase
      const formattedItem = {
        ...todoItem,
        due_date: todoItem.due_date instanceof Date ? todoItem.due_date.toISOString() : todoItem.due_date,
        notify_at: todoItem.notify_at instanceof Date ? todoItem.notify_at.toISOString() : todoItem.notify_at
      };
      
      const { data, error } = await supabase
        .from('todo_items')
        .insert([formattedItem])
        .select();
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['todoItems'] });
      
      toast({
        title: "Task added",
        description: "The task has been successfully added",
      });
      
      return data[0];
    } catch (error: any) {
      console.error('Error adding todo item:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateTodoItem = async (id: string, todoItem: Partial<Omit<TodoItem, "id" | "created_at" | "updated_at">>) => {
    try {
      // Ensure date fields are converted to ISO strings for Supabase
      const formattedItem = {
        ...todoItem,
        due_date: todoItem.due_date instanceof Date ? todoItem.due_date.toISOString() : todoItem.due_date,
        notify_at: todoItem.notify_at instanceof Date ? todoItem.notify_at.toISOString() : todoItem.notify_at
      };
      
      const { error } = await supabase
        .from('todo_items')
        .update(formattedItem)
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['todoItems'] });
      
      toast({
        title: "Task updated",
        description: "The task has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating todo item:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const markTodoItemComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .update({ completed })
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['todoItems'] });
      
      toast({
        title: completed ? "Task completed" : "Task reopened",
        description: completed 
          ? "The task has been marked as completed" 
          : "The task has been reopened",
      });
    } catch (error: any) {
      console.error('Error marking todo item complete:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const deleteTodoItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['todoItems'] });
      
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted",
      });
    } catch (error: any) {
      console.error('Error deleting todo item:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateTodoOrder = async (items: TodoItem[]) => {
    try {
      // Create an array of updates with id and new sort_order
      const updates = items.map((item, index) => ({
        id: item.id,
        sort_order: index
      }));
      
      // Update each item one by one
      for (const update of updates) {
        const { error } = await supabase
          .from('todo_items')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['todoItems'] });
    } catch (error: any) {
      console.error('Error updating todo order:', error);
      toast({
        title: "Error",
        description: "Failed to update task order",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    todoItems,
    isLoading,
    error,
    addTodoItem,
    updateTodoItem,
    markTodoItemComplete,
    deleteTodoItem,
    updateTodoOrder
  };
}
