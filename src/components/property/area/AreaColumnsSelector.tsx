
import { Label } from "@/components/ui/label";

interface AreaColumnsSelectorProps {
  columns: number;
  areaId: string;
  onColumnsChange: (columns: number) => void;
}

export function AreaColumnsSelector({ 
  columns, 
  areaId, 
  onColumnsChange 
}: AreaColumnsSelectorProps) {
  return (
    <div>
      <Label htmlFor={`columns-${areaId}`}>Image Grid Columns</Label>
      <select
        id={`columns-${areaId}`}
        value={columns}
        onChange={(e) => onColumnsChange(parseInt(e.target.value))}
        className="w-full rounded-md border border-input p-2 text-sm"
      >
        <option value={1}>1 Column</option>
        <option value={2}>2 Columns</option>
        <option value={3}>3 Columns</option>
        <option value={4}>4 Columns</option>
      </select>
    </div>
  );
}
