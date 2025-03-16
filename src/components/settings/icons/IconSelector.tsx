
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
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      <Select 
        value={value || defaultIcon} 
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select icon">
            {value && (
              <div className="flex items-center">
                <IconPreview iconName={value} className="mr-2" />
                <span>{value}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableIcons.map((iconName) => (
            <SelectItem key={iconName} value={iconName} className="flex items-center">
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
};
