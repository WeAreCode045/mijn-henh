
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ClipboardList, Plus } from "lucide-react";

interface TodoHeaderProps {
  showCompleted: boolean;
  onToggleShowCompleted: (value: boolean) => void;
  onAddClick: () => void;
}

export function TodoHeader({
  showCompleted,
  onToggleShowCompleted,
  onAddClick
}: TodoHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between pb-2">
      <div className="text-sm font-medium">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span>Tasks</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={onToggleShowCompleted}
          />
          <Label htmlFor="show-completed" className="text-xs">Show completed</Label>
        </div>
        <Button onClick={onAddClick} size="sm" className="h-8 px-2">
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
}
