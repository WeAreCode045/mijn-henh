
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/types/property";
import { Textarea } from "@/components/ui/textarea";

interface LocationDescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGenerateDescription: () => Promise<any>;
  isGenerating: boolean;
}

export function LocationDescriptionSection({
  formData,
  onFieldChange,
  onGenerateDescription,
  isGenerating
}: LocationDescriptionSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Location Description</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            onGenerateDescription();
          }}
          disabled={isGenerating}
          type="button"
        >
          {isGenerating ? "Generating..." : "Generate Description"}
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={formData.location_description || ""}
          onChange={(e) => onFieldChange("location_description", e.target.value)}
          placeholder="Describe the location of the property..."
          className="min-h-[200px]"
        />
      </CardContent>
    </Card>
  );
}
