
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
  // Make sure we have a valid default value
  const safeSelectedField = selectedField || "not_mapped";
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-1/3 font-medium text-sm">{fieldName}:</div>
      <div className="w-2/3">
        <Select 
          value={safeSelectedField} 
          onValueChange={onFieldChange}
          defaultValue="not_mapped"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an XML field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_mapped">Not mapped</SelectItem>
            {xmlFields.map((field) => (
              <SelectItem 
                key={field} 
                value={field || `field-${fieldId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}
              >
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
