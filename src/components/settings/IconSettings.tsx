
import { AgencySettings } from "@/types/agency";
import { IconSettingsGrid } from "./icons/IconSettingsGrid";

interface IconSettingsProps {
  settings: AgencySettings;
  onSelectChange: (name: string, value: string) => void;
}

export const IconSettings = ({ settings, onSelectChange }: IconSettingsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">PDF Icon Settings</h3>
      <IconSettingsGrid settings={settings} onSelectChange={onSelectChange} />
    </div>
  );
};
