
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AddressSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationData?: () => Promise<void>;
  isLoadingLocationData?: boolean;
}

export function AddressSection({
  formData,
  onFieldChange,
  onFetchLocationData,
  isLoadingLocationData = false
}: AddressSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={(e) => onFieldChange && onFieldChange("address", e.target.value)}
              placeholder="Enter full property address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location_description">Location Description</Label>
            <Textarea
              id="location_description"
              placeholder="Describe the neighborhood, amenities, and surroundings..."
              rows={4}
              value={formData.location_description || ''}
              onChange={(e) => onFieldChange && onFieldChange('location_description', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            {onFetchLocationData && (
              <Button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  onFetchLocationData();
                }}
                className="flex items-center gap-2"
                disabled={isLoadingLocationData}
              >
                {isLoadingLocationData ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {isLoadingLocationData ? "Fetching Data..." : "Get Location Data"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
