
import { useRef } from "react";
import { TodoItem as TodoItemType } from "@/types/todo";
import { TodoItem } from "./TodoItem";
import { Skeleton } from "@/components/ui/skeleton";

interface TodoListProps {
  items: TodoItemType[];
  isLoading: boolean;
  showCompleted: boolean;
  onToggleComplete: (item: TodoItemType) => void;
  onEditItem: (item: TodoItemType) => void;
  onDeleteClick: (id: string) => void;
  onUpdateOrder: (reorderedItems: TodoItemType[]) => Promise<void>;
}

export function TodoList({
  items,
  isLoading,
  showCompleted,
  onToggleComplete,
  onEditItem,
  onDeleteClick,
  onUpdateOrder
}: TodoListProps) {
  // Set up drag and drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };
  
  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };
  
  const handleDragEnd = async () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const itemsCopy = [...items];
      const draggedItemContent = itemsCopy[dragItem.current];
      
      // Remove the item from its original position
      itemsCopy.splice(dragItem.current, 1);
      
      // Insert the item at the new position
      itemsCopy.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Update the backend with the new order
      await onUpdateOrder(itemsCopy);
      
      // Reset refs
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-2 p-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {showCompleted 
          ? "No tasks found" 
          : "No incomplete tasks. Add a new task or enable 'Show completed' to see completed tasks."}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      {items.map((item, index) => (
        <TodoItem 
          key={item.id}
          item={item}
          index={index}
          onToggleComplete={onToggleComplete}
          onEditItem={onEditItem}
          onDeleteClick={onDeleteClick}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
