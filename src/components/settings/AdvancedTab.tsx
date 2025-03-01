
import { Settings } from "@/types/settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XmlImportSettings } from "./XmlImportSettings";
import { SmtpSettings } from "./SmtpSettings";

interface AdvancedTabProps {
  settings: Settings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange?: (name: string, checked: boolean) => void;
}

export function AdvancedTab({ settings, onChange, onSwitchChange }: AdvancedTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="google_maps_api_key">Google Maps API Key</Label>
        <Input
          id="google_maps_api_key"
          name="google_maps_api_key"
          value={settings.google_maps_api_key}
          onChange={onChange}
          type="password"
        />
      </div>
      
      <SmtpSettings
        settings={settings}
        onChange={onChange}
        onSwitchChange={onSwitchChange || ((name, checked) => {})}
      />
      
      <XmlImportSettings
        settings={settings}
        onChange={onChange}
      />
    </div>
  );
}
