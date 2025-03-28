
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  description: string | null;
  setDescription: (value: string | null) => void;
}

export function DescriptionSection({
  description,
  setDescription,
}: DescriptionSectionProps) {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="description" className="text-right">
        Description
      </Label>
      <Textarea
        id="description"
        value={description || ""}
        onChange={(e) => setDescription(e.target.value)}
        className="col-span-3"
        rows={4}
      />
    </div>
  );
}
