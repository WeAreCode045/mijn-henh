
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface ContentSaveButtonProps {
  onSave: () => void;
  isSaving?: boolean;
  className?: string;
}

export function ContentSaveButton({ 
  onSave, 
  isSaving = false,
  className = "" 
}: ContentSaveButtonProps) {
  return (
    <Button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className={`mt-6 w-full sm:w-auto ${className}`}
      size="default"
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  );
}
