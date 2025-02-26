
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorInputsProps {
  primaryColor: string;
  secondaryColor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorInputs = ({ primaryColor, secondaryColor, onChange }: ColorInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <div className="flex gap-2">
          <Input
            id="primaryColor"
            name="primaryColor"
            type="color"
            value={primaryColor}
            onChange={onChange}
            className="w-16 h-10 p-1"
          />
          <Input
            value={primaryColor}
            onChange={onChange}
            name="primaryColor"
            className="flex-1"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="secondaryColor">Secondary Color</Label>
        <div className="flex gap-2">
          <Input
            id="secondaryColor"
            name="secondaryColor"
            type="color"
            value={secondaryColor}
            onChange={onChange}
            className="w-16 h-10 p-1"
          />
          <Input
            value={secondaryColor}
            onChange={onChange}
            name="secondaryColor"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};
