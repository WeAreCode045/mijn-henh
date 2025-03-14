
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function DescriptionSection({ formData, onFieldChange }: DescriptionSectionProps) {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('description', e.target.value);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Description</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Label htmlFor="description">Property Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the property's features and highlights..."
            rows={6}
            value={formData.description || ''}
            onChange={handleDescriptionChange}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
