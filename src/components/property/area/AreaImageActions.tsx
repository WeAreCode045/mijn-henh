
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit, Image as ImageIcon } from "lucide-react";

interface AreaImageActionsProps {
  onSelectClick: () => void;
  onUploadClick: () => void;
}

export function AreaImageActions({ 
  onSelectClick, 
  onUploadClick 
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
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUploadClick();
          }}
          className="flex items-center"
          type="button"
        >
          <ImageIcon className="mr-1 h-3 w-3" />
          Upload
        </Button>
      </div>
    </div>
  );
}
