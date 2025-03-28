
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AgendaTabs } from "./AgendaTabs";

interface AgendaHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onAddButtonClick: (e: React.MouseEvent) => void;
}

export function AgendaHeader({ 
  activeTab, 
  onTabChange, 
  onAddButtonClick 
}: AgendaHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <AgendaTabs activeTab={activeTab} onTabChange={onTabChange} />
      <Button onClick={onAddButtonClick} size="sm" className="h-8">
        <PlusCircle className="h-4 w-4 mr-1" />
        Add Event
      </Button>
    </div>
  );
}
