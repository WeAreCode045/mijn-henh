
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Search } from "lucide-react";

interface AddressSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onFetchLocationDescription?: () => Promise<void>;
  onFetchLocationData?: () => Promise<void>;
  isLoadingLocationDescription?: boolean;
  isLoadingLocationData?: boolean;
}

export function AddressSection({
  formData,
  onFieldChange,
  onFetchLocationDescription,
  onFetchLocationData,
  isLoadingLocationDescription = false,
  isLoadingLocationData = false
}: AddressSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onFieldChange) {
      onFieldChange(e.target.name as keyof PropertyFormData, e.target.value);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Property Address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter full property address"
                className="flex-1"
              />
              {onFetchLocationData && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onFetchLocationData}
                  disabled={isLoadingLocationData || !formData.address}
                  className="whitespace-nowrap"
                >
                  {isLoadingLocationData ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Fetch Location Data
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="location_description">Location Description</Label>
              {onFetchLocationDescription && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onFetchLocationDescription}
                  disabled={isLoadingLocationDescription || !formData.address}
                  className="flex gap-2 items-center"
                >
                  {isLoadingLocationDescription ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      Generate Description
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="location_description"
              name="location_description"
              value={formData.location_description || ""}
              onChange={handleChange}
              placeholder="Describe the property location and surroundings"
              rows={6}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
