
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  isSaving: boolean;
}

export function SaveButton({ onSave, isSaving }: SaveButtonProps) {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
