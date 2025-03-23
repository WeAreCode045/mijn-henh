
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AreasList } from "@/components/property/form/steps/areas/AreasList";
import { ContentSaveButton } from "@/components/property/form/steps/common/ContentSaveButton";

interface AreasPageProps {
  formData: PropertyFormData;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  isUploading?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  onSubmit?: () => void;
  isSaving?: boolean;
}

export function AreasPage({
  formData,
  onAddArea,
  onRemoveArea,
  onUpdateArea,
  onAreaImageRemove,
  onAreaImageUpload,
  isUploading = false,
  setPendingChanges,
  onSubmit,
  isSaving = false
}: AreasPageProps) {
  
  const handleChange = () => {
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleAreaAdd = () => {
    onAddArea();
    handleChange();
  };
  
  const handleAreaRemove = (id: string) => {
    onRemoveArea(id);
    handleChange();
  };
  
  const handleAreaUpdate = (id: string, field: string, value: any) => {
    onUpdateArea(id, field, value);
    handleChange();
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Property Areas</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAreaAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Area
          </Button>
        </CardHeader>
        <CardContent>
          <AreasList
            areas={formData.areas || []}
            onRemove={handleAreaRemove}
            onUpdate={handleAreaUpdate}
            onAreaImageRemove={onAreaImageRemove}
            onAreaImageUpload={onAreaImageUpload}
            isUploading={isUploading}
          />
          
          <div className="flex justify-end mt-6">
            <ContentSaveButton onSave={handleSave} isSaving={isSaving} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
