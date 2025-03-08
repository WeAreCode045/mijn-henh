
import { AgencySettings } from "@/types/agency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XmlImportSettings } from "./XmlImportSettings";
import { SmtpSettings } from "./SmtpSettings";

interface AdvancedTabProps {
  settings: AgencySettings;
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
          name="googleMapsApiKey"
          value={settings.googleMapsApiKey || ''}
          onChange={onChange}
          type="password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="openai_api_key">OpenAI API Key</Label>
        <Input
          id="openai_api_key"
          name="openai_api_key"
          value={settings.openai_api_key || ''}
          onChange={onChange}
          type="password"
          placeholder="sk-..."
        />
        <p className="text-sm text-muted-foreground">
          Used for AI-powered features like location descriptions and content generation.
        </p>
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
