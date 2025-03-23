
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Trash } from "lucide-react";

interface PropertyModeButtonsProps {
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  onHandleClick: (e: React.MouseEvent, action: () => void) => void;
}

export function PropertyModeButtons({ 
  onSave, 
  onDelete,
  onHandleClick 
}: PropertyModeButtonsProps) {
  return (
    <div className="flex justify-end space-x-4">
      {onSave && (
        <Button 
          type="button" 
          onClick={(e) => onHandleClick(e, onSave)}
          className="flex items-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      )}
      
      {onDelete && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={(e) => onHandleClick(e, onDelete)}
          className="flex items-center space-x-2"
        >
          <Trash className="w-4 h-4" />
          <span>Delete Property</span>
        </Button>
      )}
    </div>
  );
}
