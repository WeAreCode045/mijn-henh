
import React from "react";
import { PropertyFormData } from "@/types/property";
import { GeneralInfoStep } from "@/components/property/form/steps/general-info/GeneralInfoStep";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface GeneralPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onSubmit: () => void;
  isSaving: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function GeneralPage({
  formData,
  onFieldChange,
  onSubmit,
  isSaving,
  setPendingChanges
}: GeneralPageProps) {
  const handleSave = () => {
    if (setPendingChanges) setPendingChanges(true);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <GeneralInfoStep
        formData={formData}
        onFieldChange={onFieldChange}
        setPendingChanges={setPendingChanges}
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
