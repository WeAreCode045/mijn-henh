
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableIcons } from "@/utils/iconService";
import { IconPreview } from "./IconPreview";

interface IconSelectorProps {
  label: string;
  value: string;
  defaultIcon: string;
  onChange: (value: string) => void;
}

export const IconSelector = ({ label, value, defaultIcon, onChange }: IconSelectorProps) => {
  // Ensure we never have an empty value
  const safeValue = value || defaultIcon;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      <Select 
        value={safeValue} 
        onValueChange={(value) => onChange(value)}
        defaultValue={defaultIcon}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select icon">
            {safeValue && (
              <div className="flex items-center">
                <IconPreview iconName={safeValue} className="mr-2" />
                <span>{safeValue}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableIcons.map((iconName) => (
            <SelectItem key={iconName} value={iconName || "fallback-icon"} className="flex items-center">
              <div className="flex items-center">
                <IconPreview iconName={iconName} className="mr-2" />
                <span>{iconName}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
