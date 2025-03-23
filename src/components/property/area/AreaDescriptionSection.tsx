
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { AreaDescription } from "./AreaDescription";

interface AreaDescriptionSectionProps {
  description: string;
  areaId: string;
  onDescriptionChange: (value: string) => void;
  onGenerateClick: () => void;
}

export function AreaDescriptionSection({
  description,
  areaId,
  onDescriptionChange,
  onGenerateClick
}: AreaDescriptionSectionProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <AreaDescription
          description={description}
          areaId={areaId}
          onDescriptionChange={onDescriptionChange}
        />
      </div>
      <Button 
        variant="outline" 
        className="mt-6" 
        onClick={onGenerateClick}
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Generate
      </Button>
    </div>
  );
}
