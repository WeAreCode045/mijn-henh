
import { AgencySettings } from "@/types/agency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XmlImportSettings } from "./XmlImportSettings";

interface AdvancedTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdvancedTab({ settings, onChange }: AdvancedTabProps) {
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
      <XmlImportSettings
        settings={settings}
        onChange={onChange}
      />
    </div>
  );
}
