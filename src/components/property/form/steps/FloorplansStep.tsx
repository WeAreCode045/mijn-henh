
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "@/types/property";
import { FloorplanGrid } from "../../tabs/media/floorplans/FloorplanGrid";
import { FloorplanUploader } from "../../tabs/media/floorplans/FloorplanUploader";
import { FloorplanEmbed } from "../../tabs/media/floorplans/FloorplanEmbed";
import { FloorplanProcessor } from "../../tabs/media/floorplans/FloorplanProcessor";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [parsedFloorplans, setParsedFloorplans] = useState<any[]>([]);
  const [floorplansKey, setFloorplansKey] = useState(Date.now());
  const [isProcessing, setIsProcessing] = useState(true);

  // Log the formData received
  useEffect(() => {
    console.log("FloorplansStep: formData received", formData);
    console.log("FloorplansStep: floorplans data", formData?.floorplans || []);
    
    if (formData) {
      // Ensure floorplans exist and are properly formatted
      const safeFloorplans = Array.isArray(formData.floorplans) ? formData.floorplans : [];
      console.log("FloorplansStep: safe floorplans", safeFloorplans);
      
      // Set the parsed floorplans
      setParsedFloorplans(safeFloorplans);
      setFloorplansKey(Date.now());
      setIsProcessing(false);
    } else {
      console.log("FloorplansStep: formData is null or undefined");
      setParsedFloorplans([]);
      setIsProcessing(false);
    }
  }, [formData]);

  const handleFloorplansProcessed = (processed: any[]) => {
    console.log("FloorplansStep: floorplans processed", processed);
    setParsedFloorplans(processed);
    setFloorplansKey(Date.now());
    setIsProcessing(false);
  };

  const handleEmbedScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("FloorplansStep: updating embed script:", e.target.value);
    onFieldChange('floorplanEmbedScript', e.target.value);
  };

  // If formData is completely missing or not loaded yet
  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <Spinner className="h-8 w-8 border-4" />
        <span className="text-muted-foreground">Loading form data...</span>
      </div>
    );
  }

  // Ensure floorplanEmbedScript has a default value
  const embedScript = formData.floorplanEmbedScript || '';

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
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-2 text-xs bg-gray-100 rounded mb-2">
              <p>Property ID: {formData.id || 'new'}</p>
              <p>Floorplans count: {Array.isArray(formData.floorplans) ? formData.floorplans.length : 0}</p>
            </div>
          )}
          
          {/* Process the floorplans data for display */}
          <FloorplanProcessor 
            floorplans={Array.isArray(formData.floorplans) ? formData.floorplans : []} 
            propertyId={formData.id || 'new'}
            onProcessed={handleFloorplansProcessed} 
          />
          
          {/* Uploader component - This should always be visible */}
          <FloorplanUploader isLoading={isUploading} onUpload={handleFloorplanUpload} />
          
          {/* Embed script component - make sure it gets the current script value */}
          <FloorplanEmbed 
            embedScript={embedScript} 
            onChange={handleEmbedScriptChange} 
          />

          {/* Display uploaded floorplans or loading state */}
          {isProcessing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <FloorplanGrid 
              floorplans={parsedFloorplans} 
              gridKey={floorplansKey} 
              onRemoveFloorplan={handleRemoveFloorplan} 
              onUpdateFloorplan={handleUpdateFloorplan}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
