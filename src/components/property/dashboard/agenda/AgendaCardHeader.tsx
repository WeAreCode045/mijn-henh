
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AgendaCardHeaderProps {
  onAddButtonClick: (e: React.MouseEvent) => void;
}

export function AgendaCardHeader({ onAddButtonClick }: AgendaCardHeaderProps) {
  return (
    <CardHeader className="pb-2 flex flex-row justify-between items-center">
      <CardTitle className="text-lg font-medium">Agenda</CardTitle>
      <Button 
        onClick={onAddButtonClick} 
        variant="ghost" 
        size="sm"
        className="h-8 w-8 p-0 rounded-full"
        type="button"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add agenda item</span>
      </Button>
    </CardHeader>
  );
}
