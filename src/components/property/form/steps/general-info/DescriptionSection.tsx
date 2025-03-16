
import { PropertyFormData } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  
  // Get values from generalInfo or fallback to direct properties for backwards compatibility
  const descriptionData = formData.generalInfo?.description || {
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input
            id="shortDescription"
            name="shortDescription"
            placeholder="Enter a brief summary of the property (displayed in listings)"
            value={descriptionData.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            id="fullDescription"
            name="fullDescription"
            placeholder="Enter a detailed description of the property"
            value={descriptionData.fullDescription}
            onChange={(e) => handleChange('fullDescription', e.target.value)}
            className="min-h-32"
          />
        </div>
      </CardContent>
    </Card>
  );
}
