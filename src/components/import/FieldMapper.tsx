
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FieldMapperProps {
  fieldName: string;
  fieldId: string;
  xmlFields: string[];
  selectedField: string;
  onFieldChange: (field: string) => void;
}

export function FieldMapper({
  fieldName,
  fieldId,
  xmlFields,
  selectedField,
  onFieldChange,
}: FieldMapperProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1/3 font-medium text-sm">{fieldName}:</div>
      <div className="w-2/3">
        <Select value={selectedField} onValueChange={onFieldChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an XML field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_mapped">Not mapped</SelectItem>
            {xmlFields.map((field) => (
              <SelectItem key={field} value={field || `field_${fieldId}`}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
