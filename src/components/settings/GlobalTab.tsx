
import { AgencySettings } from "@/types/agency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSettingsGrid } from "./icons/IconSettingsGrid";
import { GlobalFeaturesList } from "./features/GlobalFeaturesList";
import { GlobalFeaturesBulkUpload } from "./features/GlobalFeaturesBulkUpload";
import { PropertyFeature } from "@/types/property";

interface GlobalTabProps {
  settings: AgencySettings;
  onSelectChange: (name: string, value: string) => void;
  globalFeatures: PropertyFeature[];
  onFeatureAdd: (feature: string) => void;
  onFeatureRemove: (id: string) => void;
  onFeatureBulkUpdate: (features: string) => void;
}

export function GlobalTab({ 
  settings, 
  onSelectChange, 
  globalFeatures, 
  onFeatureAdd, 
  onFeatureRemove,
  onFeatureBulkUpdate
}: GlobalTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Icon Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <IconSettingsGrid settings={settings} onSelectChange={onSelectChange} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Global Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GlobalFeaturesList 
            features={globalFeatures} 
            onFeatureAdd={onFeatureAdd}
            onFeatureRemove={onFeatureRemove}
          />
          <GlobalFeaturesBulkUpload onBulkUpdate={onFeatureBulkUpdate} />
        </CardContent>
      </Card>
    </div>
  );
}
