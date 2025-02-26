
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgencySettings } from "@/types/agency";

interface ElementsSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ElementsSettings = ({ settings, onChange }: ElementsSettingsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Elements</h3>
      <p className="text-sm text-gray-500">These settings apply to buttons, backgrounds, borders etc.</p>
      
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color</Label>
        <div className="flex gap-2">
          <Input
            id="primaryColor"
            name="primaryColor"
            type="color"
            value={settings.primaryColor}
            onChange={onChange}
            className="w-12 h-12 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={settings.primaryColor}
            name="primaryColor"
            onChange={onChange}
            className="flex-1"
            placeholder="#000000"
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
            value={settings.secondaryColor}
            onChange={onChange}
            className="w-12 h-12 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={settings.secondaryColor}
            name="secondaryColor"
            onChange={onChange}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
};
