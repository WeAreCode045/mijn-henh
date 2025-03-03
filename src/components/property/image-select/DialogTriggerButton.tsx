
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface DialogTriggerButtonProps {
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  id?: string;
  onClick?: () => void;
  // Add the missing props that are being used in ImageSelections.tsx
  label?: string;
  className?: string;
}

export function DialogTriggerButton({
  buttonText,
  buttonIcon,
  id,
  onClick,
  label,
  className,
}: DialogTriggerButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  // Use label if provided, otherwise use buttonText
  const displayText = label || buttonText;

  if (buttonIcon) {
    return (
      <Button size="icon" variant="secondary" id={id} onClick={handleClick} className={className}>
        {buttonIcon}
      </Button>
    );
  }
  
  return (
    <Card 
      className={`flex items-center justify-center w-full h-32 border-dashed cursor-pointer hover:bg-slate-50 transition-colors ${className || ''}`} 
      id={id} 
      onClick={handleClick}
    >
      <div className="flex flex-col items-center p-4">
        <Plus className="h-8 w-8 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">{displayText}</span>
      </div>
    </Card>
  );
}
