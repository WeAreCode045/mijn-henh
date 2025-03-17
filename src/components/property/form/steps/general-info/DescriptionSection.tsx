
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange?: (section: string, field: string, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({
  formData,
  onFieldChange,
  onGeneralInfoChange,
  setPendingChanges
}: DescriptionSectionProps) {
  const descriptionInfo = formData.generalInfo?.description || {
    shortDescription: formData.shortDescription || '',
    fullDescription: formData.description || ''
  };

  const handleChange = (field: string, value: string) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('description', field, value);
    } else if (onFieldChange) {
      if (field === 'shortDescription') {
        onFieldChange('shortDescription', value);
      } else if (field === 'fullDescription') {
        onFieldChange('description', value);
      }
    }
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Description</h3>
          
          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={descriptionInfo.shortDescription || ""}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              placeholder="Brief highlight of the property (1-2 sentences)"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              value={descriptionInfo.fullDescription || ""}
              onChange={(e) => handleChange('fullDescription', e.target.value)}
              placeholder="Detailed description of the property"
              rows={8}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
