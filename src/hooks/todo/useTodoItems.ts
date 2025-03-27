
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { 
  TodoItem, 
  TodoItemInput, 
  TodoItemUpdate, 
  UseTodoItemsReturn 
} from "./types";
import {
  fetchTodoItems,
  createTodoItem,
  updateTodoItem as updateTodoItemService,
  updateTodoOrder as updateTodoOrderService,
  deleteTodoItem as deleteTodoItemService,
  addTodoItem
} from "./todoService";

export function useTodoItems(propertyId?: string): UseTodoItemsReturn {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { 
    data: todoItems = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['todoItems', propertyId],
    queryFn: () => fetchTodoItems(propertyId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const addTodoItem = async (todoItem: TodoItemInput) => {
    try {
      const newTodo = await createTodoItem(todoItem);
      
      queryClient.invalidateQueries({ queryKey: ['todoItems'] });
      
      toast({
        title: "Task added",
        description: "The task has been successfully added",
      });
      
      return newTodo;
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
  
  const updateTodoItem = async (id: string, todoItem: TodoItemUpdate) => {
    try {
      await updateTodoItemService(id, todoItem);
      
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
      await updateTodoItemService(id, { completed });
      
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
      await deleteTodoItemService(id);
      
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
      // Extract only the necessary properties for the update
      const updates = items.map((item, index) => ({
        id: item.id,
        sort_order: index
      }));
      
      await updateTodoOrderService(updates);
      
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
