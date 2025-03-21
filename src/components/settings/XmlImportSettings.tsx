
import { AgencySettings } from "@/types/agency";
import { UrlImporter } from "./import/UrlImporter";
import { FileUploader } from "./import/FileUploader";

interface XmlImportSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function XmlImportSettings({ settings, onChange }: XmlImportSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">ZIP Import Settings</h3>
      <div className="space-y-4">
        <UrlImporter settings={settings} onChange={onChange} />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <FileUploader title="Upload ZIP File" />
      </div>
    </div>
  );
}
