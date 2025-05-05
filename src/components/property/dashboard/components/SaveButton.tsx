
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  handleSaveAllFields: () => Promise<void>;
  isSaving: boolean;
}

export function SaveButton({ handleSaveAllFields, isSaving }: SaveButtonProps) {
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Save button clicked in SaveButton component");
    try {
      await handleSaveAllFields();
      console.log("Save operation completed successfully");
    } catch (error) {
      console.error("Error during save operation:", error);
    }
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
        {isSaving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
