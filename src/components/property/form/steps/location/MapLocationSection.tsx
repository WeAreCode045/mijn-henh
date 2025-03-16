
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/types/property";
import { MapPin } from "lucide-react";

interface MapLocationSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGenerateMap: () => Promise<void>;
  isGeneratingMap: boolean;
}

export function MapLocationSection({
  formData,
  onFieldChange,
  onGenerateMap,
  isGeneratingMap
}: MapLocationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.map_image ? (
          <div className="relative">
            <img
              src={formData.map_image}
              alt="Property location map"
              className="w-full rounded-md"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.preventDefault();
                onFieldChange("map_image", null);
              }}
            >
              Remove Map
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border rounded-md p-6 border-dashed">
            <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">No map image available</p>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onGenerateMap();
              }}
              disabled={isGeneratingMap || !formData.latitude || !formData.longitude}
              type="button"
            >
              {isGeneratingMap ? "Generating..." : "Generate Map"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
