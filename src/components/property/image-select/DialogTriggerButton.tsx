
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface DialogTriggerButtonProps {
  buttonText: string;
  buttonIcon?: React.ReactNode;
  id?: string;
  onClick?: () => void;
}

export function DialogTriggerButton({
  buttonText,
  buttonIcon,
  id,
  onClick,
}: DialogTriggerButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  if (buttonIcon) {
    return (
      <Button size="icon" variant="secondary" id={id} onClick={handleClick}>
        {buttonIcon}
      </Button>
    );
  }
  
  return (
    <Card 
      className="flex items-center justify-center w-full h-32 border-dashed cursor-pointer hover:bg-slate-50 transition-colors" 
      id={id} 
      onClick={handleClick}
    >
      <div className="flex flex-col items-center p-4">
        <Plus className="h-8 w-8 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">{buttonText}</span>
      </div>
    </Card>
  );
}
