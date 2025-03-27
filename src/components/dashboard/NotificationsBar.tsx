
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodoItems } from "@/hooks/todo";
import { TodoItem } from "@/hooks/todo/types";

export function NotificationsBar() {
  const [showAll, setShowAll] = useState(false);
  const { todoItems, markTodoItemComplete } = useTodoItems();
  const [dueTasks, setDueTasks] = useState<TodoItem[]>([]);
  
  useEffect(() => {
    // Filter for tasks due today or overdue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filteredTasks = todoItems.filter(task => {
      if (task.completed) return false;
      
      if (!task.due_date) return false;
      
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate <= today;
    });
    
    setDueTasks(filteredTasks);
  }, [todoItems]);
  
  const visibleTasks = showAll ? dueTasks : dueTasks.slice(0, 3);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </CardTitle>
          {dueTasks.length > 3 && (
            <Button 
              variant="ghost" 
              className="px-2 h-8 text-xs"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : "Show all"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {visibleTasks.length > 0 ? (
          <ul className="space-y-2">
            {visibleTasks.map(task => (
              <li 
                key={task.id} 
                className={cn(
                  "flex items-start p-2 rounded-md",
                  "bg-amber-50 border border-amber-200"
                )}
              >
                <div className="flex-1 pr-2">
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.due_date && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={() => markTodoItemComplete(task.id, true)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-6 text-center">
            <Check className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-sm text-gray-500">No notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
