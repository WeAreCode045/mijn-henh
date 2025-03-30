
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { DescriptionSection } from "@/components/property/form/steps/general-info/DescriptionSection";
import { PropertySpecs } from "@/components/property/form/steps/general-info/PropertySpecs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  // Local state to manage form values and avoid cursor jumping
  const [title, setTitle] = useState(formData?.title || "");

  // Update local state when formData changes
  useEffect(() => {
    if (formData?.title !== undefined) {
      setTitle(formData.title);
    }
  }, [formData?.title]);

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

  // Handle local state changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onFieldChange("title", newTitle);
    if (setPendingChanges) setPendingChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="Enter property title"
                value={title}
                onChange={handleTitleChange}
              />
            </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
