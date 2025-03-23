
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AreaDescriptionProps {
  description: string;
  areaId: string;
  onDescriptionChange: (value: string) => void;
  isReadOnly?: boolean;
}

export function AreaDescription({ 
  description, 
  areaId, 
  onDescriptionChange,
  isReadOnly = false
}: AreaDescriptionProps) {
  return (
    <div>
      <Label htmlFor={`description-${areaId}`}>Description</Label>
      <Textarea
        id={`description-${areaId}`}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Describe this area..."
        rows={4}
      />
    </div>
  );
}
