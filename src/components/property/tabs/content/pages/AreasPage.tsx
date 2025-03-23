
import React from "react";
import { PropertyFormData } from "@/types/property";
import { AreasStep } from "@/components/property/form/steps/AreasStep";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AreasPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: string, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  onAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  onSubmit: () => void;
  isSaving: boolean;
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
  onAreaImagesSelect,
  onAreaImageUpload,
  onSubmit,
  isSaving,
  isUploading,
  setPendingChanges
}: AreasPageProps) {
  const handleSave = () => {
    if (setPendingChanges) setPendingChanges(true);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <AreasStep
        formData={formData}
        onAddArea={onAddArea}
        onRemoveArea={onRemoveArea}
        onUpdateArea={onUpdateArea}
        onAreaImageRemove={onAreaImageRemove}
        onAreaImagesSelect={onAreaImagesSelect}
        onAreaImageUpload={onAreaImageUpload}
        setPendingChanges={setPendingChanges}
        isUploading={isUploading}
      />
      
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
