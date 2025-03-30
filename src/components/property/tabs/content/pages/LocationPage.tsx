
import React, { useState, useEffect } from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface LocationPageProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function LocationPage({
  formData,
  onFieldChange,
  onFetchLocationData,
  onFetchCategoryPlaces,
  onFetchNearbyCities,
  onGenerateLocationDescription,
  onGenerateMap,
  onRemoveNearbyPlace,
  isLoadingLocationData,
  isGeneratingMap,
  setPendingChanges
}: LocationPageProps) {
  const [localAddress, setLocalAddress] = useState(formData.address || "");
  const [localLocationDesc, setLocalLocationDesc] = useState(formData.location_description || "");
  
  // Update local state when formData changes
  useEffect(() => {
    if (formData?.address !== undefined) {
      setLocalAddress(formData.address);
    }
    if (formData?.location_description !== undefined) {
      setLocalLocationDesc(formData.location_description);
    }
  }, [formData?.address, formData?.location_description]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAddress(value);
    onFieldChange("address", value);
    if (setPendingChanges) setPendingChanges(true);
  };

  const handleLocationDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalLocationDesc(value);
    onFieldChange("location_description", value);
    if (setPendingChanges) setPendingChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={localAddress}
                  onChange={handleAddressChange}
                  placeholder="Enter property address"
                  className="flex-1"
                />
                {onFetchLocationData && (
                  <Button 
                    variant="outline"
                    onClick={() => onFetchLocationData()}
                    disabled={isLoadingLocationData || !localAddress}
                  >
                    {isLoadingLocationData ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Fetch Location
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location_description">Location Description</Label>
              <textarea 
                id="location_description"
                value={localLocationDesc}
                onChange={handleLocationDescChange}
                placeholder="Describe the property location"
                className="w-full border rounded-md p-2 min-h-[150px]"
              />
            </div>

            {/* Display coordinates if available */}
            {(formData.latitude || formData.longitude) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Map placeholder */}
            {formData.map_image ? (
              <div className="mt-4">
                <img 
                  src={formData.map_image} 
                  alt="Property location map" 
                  className="w-full h-auto rounded-md border"
                />
              </div>
            ) : (
              <div className="mt-4 bg-gray-100 rounded-md p-8 text-center">
                {onGenerateMap ? (
                  <Button
                    onClick={() => onGenerateMap()}
                    disabled={isGeneratingMap || !formData.latitude || !formData.longitude}
                  >
                    {isGeneratingMap ? "Generating Map..." : "Generate Map"}
                  </Button>
                ) : (
                  "No map available"
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
