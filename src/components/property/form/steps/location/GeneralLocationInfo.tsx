
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

interface GeneralLocationInfoProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData: () => Promise<void>;
  isLoadingLocationData: boolean;
}

export function GeneralLocationInfo({
  formData,
  onFieldChange,
  onFetchLocationData,
  isLoadingLocationData
}: GeneralLocationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Location Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="address">Address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => onFieldChange("address", e.target.value)}
                placeholder="123 Main St"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onFetchLocationData();
                }}
                disabled={isLoadingLocationData}
                type="button"
              >
                {isLoadingLocationData ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude || ""}
                onChange={(e) => onFieldChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0.0"
                type="number"
                step="0.0000001"
              />
            </div>
            
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude || ""}
                onChange={(e) => onFieldChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0.0"
                type="number"
                step="0.0000001"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
