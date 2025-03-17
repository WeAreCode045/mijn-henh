
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange: (section: string, field: string, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({
  formData,
  onFieldChange,
  onGeneralInfoChange,
  setPendingChanges
}: DescriptionSectionProps) {
  // Access description fields from generalInfo
  const descriptionInfo = formData.generalInfo?.description || {
    shortDescription: formData.shortDescription || '',
    fullDescription: formData.description || ''
  };

  const handleChange = (field: string, value: string) => {
    onGeneralInfoChange('description', field, value);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input
            id="shortDescription"
            value={descriptionInfo.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            placeholder="Brief overview of the property"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            id="fullDescription"
            value={descriptionInfo.fullDescription}
            onChange={(e) => handleChange('fullDescription', e.target.value)}
            placeholder="Detailed description of the property"
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
}
