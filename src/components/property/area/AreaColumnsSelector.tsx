
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AreaColumnsSelectorProps {
  columns: number;
  areaId: string;
  onColumnsChange: (columns: number) => void;
  isReadOnly?: boolean;
}

export function AreaColumnsSelector({ 
  columns, 
  areaId, 
  onColumnsChange,
  isReadOnly = false
}: AreaColumnsSelectorProps) {
  return (
    <div>
      <Label htmlFor={`columns-${areaId}`}>Image Grid Columns</Label>
      <Select
        value={columns.toString()}
        onValueChange={(value) => onColumnsChange(parseInt(value))}
        disabled={isReadOnly}
      >
        <SelectTrigger 
          id={`columns-${areaId}`}
          className="w-full"
        >
          <SelectValue placeholder="Select columns" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Column</SelectItem>
          <SelectItem value="2">2 Columns</SelectItem>
          <SelectItem value="3">3 Columns</SelectItem>
          <SelectItem value="4">4 Columns</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
