
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { FloorplanGrid } from "../../tabs/media/floorplans/FloorplanGrid";
import { FloorplanUploader } from "../../tabs/media/floorplans/FloorplanUploader";
import { FloorplanEmbed } from "../../tabs/media/floorplans/FloorplanEmbed";
import { FloorplanProcessor } from "../../tabs/media/floorplans/FloorplanProcessor";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

interface FloorplansStepProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  handleFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFloorplan: (index: number) => void;
  handleUpdateFloorplan?: (index: number, field: any, value: any) => void;
  isUploading?: boolean;
}

export function FloorplansStep({
  formData,
  onFieldChange,
  handleFloorplanUpload,
  handleRemoveFloorplan,
  handleUpdateFloorplan,
  isUploading = false
}: FloorplansStepProps) {
  const [parsedFloorplans, setParsedFloorplans] = useState(formData?.floorplans || []);
  const [floorplansKey, setFloorplansKey] = useState(Date.now());

  // Update parsed floorplans when formData.floorplans changes
  useEffect(() => {
    console.log("FloorplansStep: formData.floorplans updated", formData?.floorplans);
    setParsedFloorplans(formData?.floorplans || []);
    setFloorplansKey(Date.now());
  }, [formData?.floorplans]);

  const handleFloorplansProcessed = (processed: any[]) => {
    console.log("FloorplansStep: floorplans processed", processed);
    setParsedFloorplans(processed);
    setFloorplansKey(Date.now());
  };

  const handleEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('floorplanEmbedScript', e.target.value);
  };

  // Don't show loading message if formData exists, even if floorplans aren't defined yet
  if (!formData) {
    console.error("FloorplansStep: No formData provided");
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner className="h-8 w-8 border-4" /> 
        <span className="ml-3">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Floorplans</h3>
      <p className="text-muted-foreground text-sm">
        Upload floorplans for your property. These will be shown in the property listing and brochure.
      </p>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Upload Floorplans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Process the floorplans data for display */}
          <FloorplanProcessor 
            floorplans={formData.floorplans || []} 
            propertyId={formData.id || 'new'}
            onProcessed={handleFloorplansProcessed} 
          />
          
          {/* Uploader component */}
          <FloorplanUploader isLoading={isUploading} onUpload={handleFloorplanUpload} />
          
          {/* Embed script component */}
          <FloorplanEmbed 
            embedScript={formData.floorplanEmbedScript || ''} 
            onChange={handleEmbedScriptChange} 
          />

          {/* Display uploaded floorplans */}
          <FloorplanGrid 
            floorplans={parsedFloorplans} 
            gridKey={floorplansKey} 
            onRemoveFloorplan={handleRemoveFloorplan} 
            onUpdateFloorplan={handleUpdateFloorplan}
          />
        </CardContent>
      </Card>
    </div>
  );
}
