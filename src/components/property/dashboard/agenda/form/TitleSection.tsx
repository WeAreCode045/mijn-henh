
import { Input } from "@/components/ui/input";

interface TitleSectionProps {
  title: string;
  setTitle: (value: string) => void;
}

export function TitleSection({ title, setTitle }: TitleSectionProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="title" className="text-right col-span-1">
        Title
      </label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="col-span-3"
      />
    </div>
  );
}
