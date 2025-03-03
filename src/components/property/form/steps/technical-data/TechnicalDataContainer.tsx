
import React, { useState } from "react";
import { PropertyFormData, PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import { TechnicalItemsList } from "./components/TechnicalItemsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, Upload } from "lucide-react";

interface TechnicalDataContainerProps {
  formData?: PropertyFormData;
  technicalItems?: PropertyTechnicalItem[];
  floorplans?: PropertyFloorplan[];
  images?: any[];
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  onTechnicalItemFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>, technicalItemId: string) => void;
  isUploading?: boolean;
}

export function TechnicalDataContainer({
  formData,
  technicalItems = [],
  floorplans = [],
  images = [],
  onFieldChange,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan,
  onTechnicalItemFloorplanUpload,
  isUploading
}: TechnicalDataContainerProps) {
  const [uploading, setUploading] = useState(false);
  
  // Handle standalone floorplan upload - not tied to a technical item
  const handleFloorplanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFloorplanUpload || !e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      await onFloorplanUpload(e);
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Technical Data</h3>
      <p className="text-muted-foreground text-sm">
        Add detailed information about technical aspects of the property.
      </p>
      
      {/* Standalone floorplan upload section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Property Floorplans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floorplan-upload">Upload Floorplans</Label>
            <div className="flex items-center gap-2">
              <Input
                id="floorplan-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFloorplanUpload}
                disabled={uploading || isUploading}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10" 
                disabled={uploading || isUploading}
                asChild
              >
                <label htmlFor="floorplan-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                </label>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload floorplan images that can be linked to specific areas of the property.
            </p>
          </div>
          
          {/* Display uploaded floorplans */}
          {floorplans.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {floorplans.map((floorplan, index) => (
                <div key={floorplan.id || `floorplan-${index}`} className="relative group">
                  <img 
                    src={floorplan.url} 
                    alt={`Floorplan ${index + 1}`} 
                    className="w-full h-auto aspect-square object-cover rounded-md border"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onRemoveFloorplan && onRemoveFloorplan(index)}
                      type="button"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Technical items section */}
      <TechnicalItemsList 
        items={technicalItems} 
        floorplans={floorplans}
        onAdd={onAddTechnicalItem || (() => {})} 
        onRemove={onRemoveTechnicalItem || (() => {})} 
        onUpdate={onUpdateTechnicalItem || (() => {})}
        onFloorplanUpload={onTechnicalItemFloorplanUpload}
      />
    </div>
  );
}
