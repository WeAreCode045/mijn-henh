import React from "react";
import { PropertyFormData } from "@/types/property";
import { DescriptionSection } from "@/components/property/form/steps/general-info/DescriptionSection";
import { PropertySpecs } from "@/components/property/form/steps/general-info/PropertySpecs";

interface GeneralPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: PropertyFormData[keyof PropertyFormData]) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function GeneralPage({
  formData,
  onFieldChange,
  setPendingChanges,
}: GeneralPageProps) {
  // Log to help with debugging
  console.log("GeneralPage - Form data:", {
    title: formData?.title,
    description: formData?.description
      ? formData.description.substring(0, 20) + "..."
      : "N/A",
    hasData: !!formData,
  });

  if (!formData) {
    return <div>Loading property data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Description (2/3 width) */}
        <div className="lg:col-span-2">
          <DescriptionSection
            formData={formData}
            onFieldChange={onFieldChange}
            setPendingChanges={setPendingChanges}
          />
        </div>

        {/* Key Information (1/3 width) */}
        <div className="lg:col-span-1">
          <PropertySpecs
            formData={{
              ...formData,
              objectId: formData.object_id || "defaultObjectId", // Ensure objectId is provided
            }}
            onFieldChange={onFieldChange}
            setPendingChanges={setPendingChanges}
          />
        </div>
      </div>
    </div>
  );
}
