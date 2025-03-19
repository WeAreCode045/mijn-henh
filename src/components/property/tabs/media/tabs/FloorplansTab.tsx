
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { FloorplansCard } from "../FloorplansCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LayoutIcon } from "lucide-react";

interface FloorplansTabProps {
  property: PropertyData;
  setProperty: React.Dispatch<React.SetStateAction<PropertyData>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  handlers?: {
    handleFloorplanEmbedScriptUpdate: (script: string) => void;
  };
}

export function FloorplansTab({
  property,
  setProperty,
  isSaving,
  setIsSaving,
  handlers
}: FloorplansTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [floorplanEmbedScript, setFloorplanEmbedScript] = useState<string>(property.floorplanEmbedScript || "");
  
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !property.id) return;
    
    setIsUploading(true);
    
    try {
      console.log("Uploading floorplans...");
      // Simulating successful upload
      const newFloorplans = Array.from(e.target.files).map(file => ({
        id: `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        url: URL.createObjectURL(file),
        type: "floorplan" as const
      }));
      
      // Update the property with new floorplans
      setProperty(prev => ({
        ...prev,
        floorplans: [...(prev.floorplans || []), ...newFloorplans]
      }));
      
    } catch (error) {
      console.error("Error uploading floorplans:", error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };
  
  const handleRemoveFloorplan = (index: number) => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property by removing the floorplan at the specified index
      setProperty(prev => ({
        ...prev,
        floorplans: prev.floorplans.filter((_, i) => i !== index)
      }));
      
    } catch (error) {
      console.error("Error removing floorplan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFloorplanEmbed = () => {
    if (!property.id) return;
    
    setIsSaving(true);
    
    try {
      // Update the property with the new floorplan embed script
      setProperty(prev => ({
        ...prev,
        floorplanEmbedScript
      }));
      
      // Call the handler if provided
      if (handlers?.handleFloorplanEmbedScriptUpdate) {
        handlers.handleFloorplanEmbedScriptUpdate(floorplanEmbedScript);
      }
    } catch (error) {
      console.error("Error saving floorplan embed script:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <FloorplansCard
        floorplans={property.floorplans || []}
        onFloorplanUpload={handleFloorplanUpload}
        onRemoveFloorplan={handleRemoveFloorplan}
        isUploading={isUploading}
        propertyId={property.id}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutIcon className="h-5 w-5" />
            Floorplan Embed Script
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If you have an interactive floorplan service, paste the embed script here.
            </p>
            <Textarea
              value={floorplanEmbedScript}
              onChange={(e) => setFloorplanEmbedScript(e.target.value)}
              placeholder="Paste floorplan embed script here"
              rows={6}
            />
            <Button onClick={handleSaveFloorplanEmbed} disabled={isSaving}>
              Save Floorplan Embed
            </Button>
          </div>
          
          {floorplanEmbedScript && (
            <div className="mt-4 aspect-video w-full border rounded-md">
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: floorplanEmbedScript }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
