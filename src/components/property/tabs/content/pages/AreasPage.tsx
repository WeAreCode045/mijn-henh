
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreasList } from "@/components/property/form/steps/areas/AreasList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AreasPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function AreasPage({
  formData,
  onFieldChange,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImageUpload,
  isUploading = false,
  setPendingChanges
}: AreasPageProps) {
  const handleAddArea = () => {
    onAddArea();
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Property Areas</CardTitle>
          <Button
            size="sm"
            onClick={handleAddArea}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Area
          </Button>
        </CardHeader>
        <CardContent>
          <AreasList
            areas={formData.areas || []}
            onRemove={(id) => {
              onRemoveArea(id);
              if (setPendingChanges) {
                setPendingChanges(true);
              }
            }}
            onUpdate={(id, field, value) => {
              onUpdateArea(id, field, value);
              if (setPendingChanges) {
                setPendingChanges(true);
              }
            }}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImageUpload={onAreaImageUpload}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
