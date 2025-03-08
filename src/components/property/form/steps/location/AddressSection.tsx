
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AddressSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationDescription?: () => Promise<void>;
  isLoadingLocationDescription?: boolean;
}

export function AddressSection({
  formData,
  onFieldChange,
  onFetchLocationDescription,
  isLoadingLocationDescription = false
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
            <div className="flex justify-between items-center">
              <Label htmlFor="location_description">Location Description</Label>
              
              {onFetchLocationDescription && (
                <Button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    onFetchLocationDescription();
                  }}
                  className="flex items-center gap-2"
                  disabled={isLoadingLocationDescription}
                >
                  {isLoadingLocationDescription ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {isLoadingLocationDescription ? "Generating..." : "Generate Description"}
                </Button>
              )}
            </div>
            
            <Textarea
              id="location_description"
              placeholder="Describe the neighborhood, amenities, and surroundings..."
              rows={4}
              value={formData.location_description || ''}
              onChange={(e) => onFieldChange && onFieldChange('location_description', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
