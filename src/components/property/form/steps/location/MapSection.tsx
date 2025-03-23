
import React, { useState } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MapSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function MapSection({
  formData,
  onFieldChange,
  onFetchLocationData,
  onGenerateMap,
  isLoadingLocationData = false,
  isGeneratingMap = false,
  setPendingChanges
}: MapSectionProps) {
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  // Render map image if available
  const mapImageUrl = formData.map_image_url;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Location</CardTitle>
        
        <div className="flex items-center space-x-2">
          {onFetchLocationData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFetchLocationData?.()}
              disabled={isLoadingLocationData || !formData.address}
            >
              {isLoadingLocationData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Fetch Coordinates
                </>
              )}
            </Button>
          )}
          
          {onGenerateMap && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateMap?.()}
              disabled={isGeneratingMap || !formData.latitude || !formData.longitude}
            >
              {isGeneratingMap ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Map
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Coordinates Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              value={formData.latitude || ''}
              onChange={handleCoordinateChange}
              placeholder="e.g. 51.5074"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              value={formData.longitude || ''}
              onChange={handleCoordinateChange}
              placeholder="e.g. -0.1278"
            />
          </div>
        </div>
        
        {/* Map Preview */}
        {mapImageUrl ? (
          <div className="mt-4 relative">
            <img 
              src={mapImageUrl} 
              alt="Property location map" 
              className="w-full h-auto rounded-md border border-border"
            />
          </div>
        ) : (
          <div className="mt-4 bg-muted rounded-md p-8 flex items-center justify-center border border-border">
            <p className="text-muted-foreground text-center">
              {formData.latitude && formData.longitude ? (
                "Click 'Generate Map' to create a map image"
              ) : (
                "Enter address or coordinates to enable map generation"
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
