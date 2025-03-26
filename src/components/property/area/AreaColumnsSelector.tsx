
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
}

export function AreaColumnsSelector({ 
  columns, 
  areaId, 
  onColumnsChange 
}: AreaColumnsSelectorProps) {
  // Ensure we have a valid columns value
  const safeColumns = columns || 2;
  
  return (
    <div>
      <Label htmlFor={`columns-${areaId}`}>Image Grid Columns</Label>
      <Select
        value={safeColumns.toString()}
        onValueChange={(value) => onColumnsChange(parseInt(value))}
        defaultValue="2" // Default to 2 columns
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
