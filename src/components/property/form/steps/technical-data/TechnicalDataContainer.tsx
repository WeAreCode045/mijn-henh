
import React from "react";
import { PropertyFormData, PropertyTechnicalItem, PropertyFloorplan } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechnicalDataForm } from "./TechnicalDataForm";
import { FloorplanUpload } from "./FloorplanUpload";

interface TechnicalDataContainerProps {
  formData?: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onAddTechnicalItem?: () => void;
  onRemoveTechnicalItem?: (id: string) => void;
  onUpdateTechnicalItem?: (id: string, field: keyof PropertyTechnicalItem, value: any) => void;
  onFloorplanUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFloorplan?: (index: number) => void;
  onUpdateFloorplan?: (index: number, field: keyof PropertyFloorplan, value: any) => void;
  isUploading?: boolean;
}

export function TechnicalDataContainer({
  formData = {} as PropertyFormData,
  onFieldChange,
  onAddTechnicalItem,
  onRemoveTechnicalItem,
  onUpdateTechnicalItem,
  onFloorplanUpload,
  onRemoveFloorplan,
  onUpdateFloorplan,
  isUploading = false,
}: TechnicalDataContainerProps) {
  return (
    <div className="space-y-6">
      {/* Embed Code section */}
      <Card>
        <CardHeader>
          <CardTitle>Floorplan Embed Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Paste your floorplan embed code here..."
              value={formData.floorplanEmbedScript || ""}
              onChange={(e) => onFieldChange?.("floorplanEmbedScript", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              You can paste embed codes from Matterport, FloorPlanner, or other services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Floorplan Uploads */}
      <FloorplanUpload
        floorplans={formData.floorplans || []}
        onFloorplanUpload={onFloorplanUpload}
        onRemoveFloorplan={onRemoveFloorplan}
        onUpdateFloorplan={onUpdateFloorplan}
        isUploading={isUploading}
      />

      {/* Technical Data Items */}
      <TechnicalDataForm
        technicalItems={formData.technicalItems || []}
        onAddTechnicalItem={onAddTechnicalItem}
        onRemoveTechnicalItem={onRemoveTechnicalItem}
        onUpdateTechnicalItem={onUpdateTechnicalItem}
      />
    </div>
  );
}
