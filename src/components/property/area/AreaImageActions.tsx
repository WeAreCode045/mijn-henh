
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface AreaImageActionsProps {
  onSelectClick: () => void;
}

export function AreaImageActions({
  onSelectClick
}: AreaImageActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSelectClick}
        type="button"
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        Select Images
      </Button>
    </div>
  );
}
