
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  description: string;
  setDescription: (value: string) => void;
}

export function DescriptionSection({ description, setDescription }: DescriptionSectionProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="description" className="text-right col-span-1">
        Details
      </label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="col-span-3"
        rows={4}
      />
    </div>
  );
}
