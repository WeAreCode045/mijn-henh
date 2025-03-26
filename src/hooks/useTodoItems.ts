
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { TodoItem } from "@/types/todo";

export function useTodoItems(propertyId?: string) {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchTodoItems = async () => {
    if (!profile?.id) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('todo_items')
        .select(`
          *,
          property:property_id (
            id,
            title
          ),
          assigned_to:assigned_to_id (
            id,
            full_name
          )
        `)
        .order('sort_order', { ascending: true });
      
      // If propertyId is provided, filter by property
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTodoItems(data || []);
    } catch (error: any) {
      console.error('Error fetching todo items:', error);
      toast({
        title: "Error",
        description: "Failed to load todo items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTodoItem = async (itemData: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    try {
      // Get max sort_order and add 1
      const maxSortOrder = todoItems.length > 0 
        ? Math.max(...todoItems.map(item => item.sort_order || 0)) 
        : 0;
      
      const { error } = await supabase
        .from('todo_items')
        .insert({
          ...itemData,
          sort_order: maxSortOrder + 1
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Todo item added successfully",
      });
      
      fetchTodoItems();
    } catch (error: any) {
      console.error('Error adding todo item:', error);
      toast({
        title: "Error",
        description: "Failed to add todo item",
        variant: "destructive",
      });
    }
  };

  const updateTodoItem = async (
    itemId: string, 
    itemData: Omit<TodoItem, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .update(itemData)
        .eq('id', itemId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Todo item updated successfully",
      });
      
      fetchTodoItems();
    } catch (error: any) {
      console.error('Error updating todo item:', error);
      toast({
        title: "Error",
        description: "Failed to update todo item",
        variant: "destructive",
      });
    }
  };

  const deleteTodoItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Todo item deleted successfully",
      });
      
      fetchTodoItems();
    } catch (error: any) {
      console.error('Error deleting todo item:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo item",
        variant: "destructive",
      });
    }
  };

  const markTodoItemComplete = async (itemId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todo_items')
        .update({ completed })
        .eq('id', itemId);

      if (error) throw error;
      
      // Update local state to avoid refetching
      setTodoItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, completed } : item
        )
      );
    } catch (error: any) {
      console.error('Error updating todo item status:', error);
      toast({
        title: "Error",
        description: "Failed to update todo item status",
        variant: "destructive",
      });
    }
  };

  const reorderTodoItems = async (startIndex: number, endIndex: number) => {
    const reorderedItems = Array.from(todoItems);
    const [removed] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, removed);
    
    // Update the sort_order values
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      sort_order: index
    }));
    
    // Update local state optimistically
    setTodoItems(updatedItems);
    
    // Save to the database
    try {
      const updatePromises = updatedItems.map(item => 
        supabase
          .from('todo_items')
          .update({ sort_order: item.sort_order })
          .eq('id', item.id)
      );
      
      await Promise.all(updatePromises);
    } catch (error: any) {
      console.error('Error reordering items:', error);
      toast({
        title: "Error",
        description: "Failed to save the new order",
        variant: "destructive",
      });
      
      // Revert to previous state on error
      fetchTodoItems();
    }
  };

  // Setup notification permission and display
  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Check for due notifications every minute
    const checkNotifications = async () => {
      const now = new Date();
      
      todoItems.forEach(item => {
        if (
          item.notify_at && 
          !item.completed &&
          !item.notification_sent && 
          new Date(item.notify_at) <= now
        ) {
          // Show notification
          if (Notification.permission === "granted") {
            new Notification(item.title, {
              body: item.description || "Task reminder",
              icon: "/favicon.ico"
            });
            
            // Mark notification as sent
            supabase
              .from('todo_items')
              .update({ notification_sent: true })
              .eq('id', item.id);
              
            // Update local state
            setTodoItems(prev => 
              prev.map(todo => 
                todo.id === item.id ? { ...todo, notification_sent: true } : todo
              )
            );
          }
        }
      });
    };
    
    const notificationInterval = setInterval(checkNotifications, 60000);
    
    return () => clearInterval(notificationInterval);
  }, [todoItems]);

  useEffect(() => {
    if (profile?.id) {
      fetchTodoItems();
    }
  }, [profile?.id, propertyId]);

  return {
    todoItems,
    isLoading,
    addTodoItem,
    updateTodoItem,
    deleteTodoItem,
    markTodoItemComplete,
    reorderTodoItems,
    refreshTodoItems: fetchTodoItems
  };
}
