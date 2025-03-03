
import { AgencySettings } from "@/types/agency";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AppwriteSettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AppwriteSettings({ settings, onChange }: AppwriteSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appwrite Configuration</CardTitle>
        <CardDescription>
          Configure Appwrite settings to connect to your Appwrite project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="appwrite_endpoint">Appwrite Endpoint</Label>
          <Input
            id="appwrite_endpoint"
            name="appwrite_endpoint"
            placeholder="https://cloud.appwrite.io/v1"
            value={settings.appwrite_endpoint || ''}
            onChange={onChange}
          />
          <p className="text-xs text-gray-500">Usually https://cloud.appwrite.io/v1 for Appwrite Cloud</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="appwrite_project_id">Project ID</Label>
          <Input
            id="appwrite_project_id"
            name="appwrite_project_id"
            placeholder="Your Appwrite Project ID"
            value={settings.appwrite_project_id || ''}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="appwrite_database_id">Database ID</Label>
          <Input
            id="appwrite_database_id"
            name="appwrite_database_id"
            placeholder="Your Appwrite Database ID"
            value={settings.appwrite_database_id || ''}
            onChange={onChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appwrite_properties_collection_id">Properties Collection ID</Label>
            <Input
              id="appwrite_properties_collection_id"
              name="appwrite_properties_collection_id"
              placeholder="Collection ID for properties"
              value={settings.appwrite_properties_collection_id || ''}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="appwrite_agents_collection_id">Agents Collection ID</Label>
            <Input
              id="appwrite_agents_collection_id"
              name="appwrite_agents_collection_id"
              placeholder="Collection ID for agents"
              value={settings.appwrite_agents_collection_id || ''}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appwrite_templates_collection_id">Templates Collection ID</Label>
            <Input
              id="appwrite_templates_collection_id"
              name="appwrite_templates_collection_id"
              placeholder="Collection ID for templates"
              value={settings.appwrite_templates_collection_id || ''}
              onChange={onChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="appwrite_storage_bucket_id">Storage Bucket ID</Label>
            <Input
              id="appwrite_storage_bucket_id"
              name="appwrite_storage_bucket_id"
              placeholder="ID for storage bucket"
              value={settings.appwrite_storage_bucket_id || ''}
              onChange={onChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
