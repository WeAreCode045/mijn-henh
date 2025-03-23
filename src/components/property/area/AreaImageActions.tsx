
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

interface AreaImageActionsProps {
  onSelectClick: () => void;
}

export function AreaImageActions({ 
  onSelectClick
}: AreaImageActionsProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <Label>Images</Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelectClick();
          }}
          className="flex items-center"
          type="button"
        >
          <Edit className="mr-1 h-3 w-3" />
          Select Images
        </Button>
      </div>
    </div>
  );
}
