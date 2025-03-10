
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

interface PropertyFormActionsProps {
  isSubmitting: boolean;
  onSave: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function PropertyFormActions({ 
  isSubmitting, 
  onSave, 
  onDelete, 
  showDelete = false 
}: PropertyFormActionsProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button 
        variant="default" 
        onClick={onSave} 
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Save Property
      </Button>
      
      {showDelete && onDelete && (
        <Button 
          variant="destructive" 
          onClick={onDelete}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      )}
    </div>
  );
}
