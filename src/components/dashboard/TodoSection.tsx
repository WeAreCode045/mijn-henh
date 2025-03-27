import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter } from "lucide-react";
import { TodoList } from "./todo/TodoList";
import { TodoDialog } from "./todo/TodoDialog";
import { useTodoItems } from "@/hooks/todo/useTodoItems";
import { useProperties } from "@/hooks/useProperties";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TodoItem } from "@/hooks/todo/types";

export function TodoSection() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TodoItem | undefined>(undefined);
  const [filteredItems, setFilteredItems] = useState<TodoItem[]>([]);
  const [filterByProperty, setFilterByProperty] = useState(false);
  
  const { todoItems, isLoading, addTodoItem, updateTodoItem, markTodoItemComplete, deleteTodoItem, updateTodoOrder } = useTodoItems();
  const { selectedProperty } = useProperties();

  useEffect(() => {
    // Filter items based on completion status and property filter
    let items = [...todoItems];
    
    // Filter by completion status
    if (!showCompleted) {
      items = items.filter(item => !item.completed);
    }
    
    // Filter by property if enabled
    if (filterByProperty && selectedProperty) {
      items = items.filter(item => 
        item.property_id === selectedProperty.id || 
        item.property_id === null
      );
    }
    
    setFilteredItems(items);
  }, [todoItems, showCompleted, filterByProperty, selectedProperty]);
  
  const handleAddClick = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };
  
  const handleEditItem = (item: TodoItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };
  
  const handleToggleComplete = async (item: TodoItem) => {
    await markTodoItemComplete(item.id, !item.completed);
  };
  
  const handleDeleteItem = async (id: string) => {
    await deleteTodoItem(id);
  };
  
  const handleSaveTodoItem = async (data: Omit<TodoItem, "id" | "created_at" | "updated_at">) => {
    // If property filtering is enabled and there's a selected property, set it as default
    if (filterByProperty && selectedProperty && !data.property_id) {
      data.property_id = selectedProperty.id;
    }
    
    if (selectedItem) {
      await updateTodoItem(selectedItem.id, data);
    } else {
      await addTodoItem(data);
    }
  };
  
  return (
    <CardContent className="p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-completed" 
              checked={showCompleted} 
              onCheckedChange={setShowCompleted} 
            />
            <Label htmlFor="show-completed">Show completed</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="filter-property" 
              checked={filterByProperty} 
              onCheckedChange={setFilterByProperty}
              disabled={!selectedProperty}
            />
            <Label htmlFor="filter-property">
              {selectedProperty 
                ? `Show only ${selectedProperty.title}` 
                : "No property selected"}
            </Label>
          </div>
        </div>
        
        <Button onClick={handleAddClick} size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      <TodoList 
        items={filteredItems} 
        isLoading={isLoading} 
        showCompleted={showCompleted}
        onToggleComplete={handleToggleComplete}
        onEditItem={handleEditItem}
        onDeleteClick={handleDeleteItem}
        onUpdateOrder={updateTodoOrder}
      />
      
      <TodoDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveTodoItem}
        item={selectedItem}
        mode={selectedItem ? "edit" : "add"}
      />
    </CardContent>
  );
}
