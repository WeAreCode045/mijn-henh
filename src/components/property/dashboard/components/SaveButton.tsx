
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  handleSaveAllFields: () => Promise<void>;
  isSaving: boolean;
}

export function SaveButton({ handleSaveAllFields, isSaving }: SaveButtonProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveAllFields();
  };

  return (
    <div className="flex justify-end mb-4">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleSaveClick}
        disabled={isSaving}
        className="flex items-center gap-2"
        type="button"
      >
        <Save className="h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
}
