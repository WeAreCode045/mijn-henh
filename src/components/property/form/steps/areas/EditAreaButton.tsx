
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditAreaButtonProps {
  onClick: () => void;
  label?: string;
}

export function EditAreaButton({ onClick, label = "Edit" }: EditAreaButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    onClick();
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleClick}
      type="button" // Explicitly set as button type
      className="flex items-center gap-1"
    >
      <Edit className="h-4 w-4" />
      {label}
    </Button>
  );
}
