
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

interface LocationDescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onGenerateDescription?: () => Promise<void>;
  isGeneratingDescription?: boolean;
  isReadOnly?: boolean;
}

export function LocationDescriptionSection({
  formData,
  onFieldChange,
  onGenerateDescription,
  isGeneratingDescription = false,
  isReadOnly = false
}: LocationDescriptionSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isReadOnly || !onFieldChange) return;
    onFieldChange(e.target.name as keyof PropertyFormData, e.target.value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="location_description">Location Description</Label>
              {onGenerateDescription && !isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onGenerateDescription();
                  }}
                  disabled={isGeneratingDescription || !formData.address}
                  className="flex gap-2 items-center"
                >
                  {isGeneratingDescription ? (
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
              readOnly={isReadOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
