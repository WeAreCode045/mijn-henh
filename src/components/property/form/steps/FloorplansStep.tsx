
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface FloorplansStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function FloorplansStep({
  formData,
  onFieldChange
}: FloorplansStepProps) {
  // Default to empty string if formData or floorplanEmbedScript is undefined
  const [embedScript, setEmbedScript] = useState<string>('');

  useEffect(() => {
    // Safely update local state when formData changes externally
    if (formData && formData.floorplanEmbedScript !== undefined) {
      setEmbedScript(formData.floorplanEmbedScript);
    }
  }, [formData]);

  const handleEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEmbedScript(newValue);
    onFieldChange('floorplanEmbedScript', newValue);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Floorplans</h3>
      <p className="text-muted-foreground text-sm">
        Paste an embed code from Matterport, iGuide, or other 3D tour providers to display interactive floorplans.
      </p>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Interactive Floorplan Embed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floorplan-embed">Floorplan Embed Script</Label>
            <Textarea
              id="floorplan-embed"
              placeholder="Paste your 3D/virtual floorplan embed script here..."
              className="min-h-[150px] font-mono text-xs"
              value={embedScript}
              onChange={handleEmbedScriptChange}
            />
            <p className="text-xs text-muted-foreground">
              Paste embed code from Matterport, iGuide, or other 3D tour providers. This will be displayed on the property webview.
            </p>
          </div>

          {embedScript && (
            <div className="mt-6 space-y-2">
              <Label>Preview</Label>
              <div className="w-full h-[400px] border rounded-md overflow-hidden bg-gray-50">
                <div 
                  className="w-full h-full" 
                  dangerouslySetInnerHTML={{ __html: embedScript }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
