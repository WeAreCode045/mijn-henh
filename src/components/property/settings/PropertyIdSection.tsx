
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileType, Save } from "lucide-react";

interface PropertyIdSectionProps {
  objectId: string;
  onSave: (objectId: string) => Promise<void>;
  isDisabled?: boolean; // Added isDisabled prop
  isUpdating?: boolean;
}

export function PropertyIdSection({ 
  objectId, 
  onSave, 
  isDisabled = false,
  isUpdating = false
}: PropertyIdSectionProps) {
  const [currentObjectId, setCurrentObjectId] = useState(objectId || "");

  const handleSave = () => {
    onSave(currentObjectId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileType className="h-5 w-5" />
          Property Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="object-id">Object ID</Label>
          <Input
            id="object-id"
            value={currentObjectId}
            onChange={(e) => setCurrentObjectId(e.target.value)}
            placeholder="Enter object ID"
            disabled={isDisabled}
          />
          <p className="text-xs text-muted-foreground">
            This ID is used as a reference in external systems
          </p>
        </div>
        
        <Button onClick={handleSave} disabled={isUpdating || isDisabled}>
          <Save className="h-4 w-4 mr-2" />
          {isUpdating ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
