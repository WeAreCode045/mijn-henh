
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface EditButtonProps {
  isEditing: boolean;
  onToggle: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function EditButton({ 
  isEditing, 
  onToggle, 
  onSave, 
  isSaving = false,
  size = "sm"
}: EditButtonProps) {
  const handleAction = (e: React.MouseEvent) => {
    // Prevent default to avoid page reload
    e.preventDefault();
    
    if (isEditing && onSave) {
      onSave();
    } else {
      onToggle();
    }
  };

  return (
    <Button
      variant={isEditing ? "default" : "outline"}
      size={size}
      onClick={handleAction}
      disabled={isSaving}
      className="flex items-center gap-2"
    >
      {isEditing ? (
        <>
          {isSaving ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </>
      ) : (
        <>
          <Edit className="h-4 w-4" />
          Edit
        </>
      )}
    </Button>
  );
}
