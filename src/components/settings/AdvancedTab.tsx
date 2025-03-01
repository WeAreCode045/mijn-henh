
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
        <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
        <Input
          id="googleMapsApiKey"
          name="googleMapsApiKey"
          value={settings.googleMapsApiKey}
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
