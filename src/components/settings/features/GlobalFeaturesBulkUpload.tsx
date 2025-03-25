
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface GlobalFeaturesBulkUploadProps {
  onBulkUpdate: (features: string) => void;
}

export function GlobalFeaturesBulkUpload({
  onBulkUpdate
}: GlobalFeaturesBulkUploadProps) {
  const [bulkFeatures, setBulkFeatures] = useState("");

  const handleBulkUpload = () => {
    if (bulkFeatures.trim()) {
      onBulkUpdate(bulkFeatures.trim());
      setBulkFeatures("");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="bulk-features">Bulk Upload Features</Label>
      <div className="space-y-2">
        <Textarea
          id="bulk-features"
          value={bulkFeatures}
          onChange={(e) => setBulkFeatures(e.target.value)}
          placeholder="Enter features separated by commas, e.g.: Garden, Swimming Pool, Garage, Air Conditioning"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Enter features separated by commas. New features will be added, existing features will be kept.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBulkUpload}
          disabled={!bulkFeatures.trim()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Update Features
        </Button>
      </div>
    </div>
  );
}
