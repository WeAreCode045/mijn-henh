
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicDetails } from "@/components/property/form/steps/general-info/BasicDetails";
import { DescriptionSection } from "@/components/property/form/steps/general-info/DescriptionSection";
import { PropertySpecs } from "@/components/property/form/steps/general-info/PropertySpecs";

interface GeneralPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function GeneralPage({
  formData,
  onFieldChange,
  setPendingChanges
}: GeneralPageProps) {
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
            formData={formData} 
            onFieldChange={onFieldChange}
            setPendingChanges={setPendingChanges}
          />
        </div>
      </div>
      
      {/* Basic Details */}
      <BasicDetails 
        formData={formData}
        onFieldChange={onFieldChange}
        setPendingChanges={setPendingChanges}
      />
    </div>
  );
}
