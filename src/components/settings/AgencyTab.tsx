
import { AgencySettings } from "@/types/agency";
import { AgencyFields } from "./AgencyFields";
import { LogoUpload } from "./LogoUpload";

interface AgencyTabProps {
  settings: AgencySettings;
  logoPreview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AgencyTab({ settings, logoPreview, onChange, onLogoUpload }: AgencyTabProps) {
  return (
    <div className="space-y-6">
      <LogoUpload logoPreview={logoPreview} onLogoUpload={onLogoUpload} />
      <AgencyFields settings={settings} onChange={onChange} />
    </div>
  );
}
