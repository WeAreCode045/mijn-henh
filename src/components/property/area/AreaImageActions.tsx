
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface AreaImageActionsProps {
  onSelectClick: () => void;
  isReadOnly?: boolean;
}

export function AreaImageActions({ 
  onSelectClick,
  isReadOnly = false
}: AreaImageActionsProps) {
  return (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSelectClick}
        disabled={isReadOnly}
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        Select Images
      </Button>
    </div>
  );
}
