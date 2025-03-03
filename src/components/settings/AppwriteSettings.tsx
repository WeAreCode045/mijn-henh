
import { AgencySettings } from "@/types/agency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AppwriteSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AppwriteSettings({ settings, onChange }: AppwriteSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appwrite Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure your Appwrite connection details to use Appwrite as a backend service.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_endpoint">Appwrite Endpoint</Label>
        <Input
          id="appwrite_endpoint"
          name="appwrite_endpoint"
          value={settings.appwrite_endpoint || ''}
          onChange={onChange}
          placeholder="https://cloud.appwrite.io/v1"
        />
        <p className="text-xs text-muted-foreground">The URL of your Appwrite server. Default: https://cloud.appwrite.io/v1</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_project_id">Project ID</Label>
        <Input
          id="appwrite_project_id"
          name="appwrite_project_id"
          value={settings.appwrite_project_id || ''}
          onChange={onChange}
          placeholder="Enter your Appwrite project ID"
        />
        <p className="text-xs text-muted-foreground">The ID of your Appwrite project</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_database_id">Database ID</Label>
        <Input
          id="appwrite_database_id"
          name="appwrite_database_id"
          value={settings.appwrite_database_id || ''}
          onChange={onChange}
          placeholder="Enter your Appwrite database ID"
        />
        <p className="text-xs text-muted-foreground">The ID of your Appwrite database</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_collection_properties_id">Properties Collection ID</Label>
        <Input
          id="appwrite_collection_properties_id"
          name="appwrite_collection_properties_id"
          value={settings.appwrite_collection_properties_id || ''}
          onChange={onChange}
          placeholder="Enter your properties collection ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_collection_agents_id">Agents Collection ID</Label>
        <Input
          id="appwrite_collection_agents_id"
          name="appwrite_collection_agents_id"
          value={settings.appwrite_collection_agents_id || ''}
          onChange={onChange}
          placeholder="Enter your agents collection ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_collection_templates_id">Templates Collection ID</Label>
        <Input
          id="appwrite_collection_templates_id"
          name="appwrite_collection_templates_id"
          value={settings.appwrite_collection_templates_id || ''}
          onChange={onChange}
          placeholder="Enter your templates collection ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appwrite_storage_bucket_id">Storage Bucket ID</Label>
        <Input
          id="appwrite_storage_bucket_id"
          name="appwrite_storage_bucket_id"
          value={settings.appwrite_storage_bucket_id || ''}
          onChange={onChange}
          placeholder="Enter your storage bucket ID"
        />
        <p className="text-xs text-muted-foreground">The ID of your Appwrite storage bucket for uploads</p>
      </div>
    </div>
  );
}
