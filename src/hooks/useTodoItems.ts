
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  due_date?: Date | null;
  notify_at?: Date | null;
  notification_sent: boolean;
  completed: boolean;
  property_id?: string | null;
  assigned_to_id?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useTodoItems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const fetchTodoItems = async (): Promise<TodoItem[]> => {
    const { data, error } = await supabase
      .from('todo_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      ...item,
      due_date: item.due_date ? new Date(item.due_date) : null,
      notify_at: item.notify_at ? new Date(item.notify_at) : null
    }));
  };
  
  const { data: todoItems = [], isLoading, error } = useQuery({
    queryKey: ['todoItems'],
    queryFn: fetchTodoItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const addTodoItem = async (todoItem: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('todo_items')
        .insert([todoItem])
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
      const { error } = await supabase
        .from('todo_items')
        .update(todoItem)
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
