
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
  
  const handleLocationDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange('location_description', e.target.value);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Description & Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Property Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the property's features and highlights..."
            rows={6}
            value={formData.description || ''}
            onChange={handleDescriptionChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location_description">Location Description</Label>
          <Textarea
            id="location_description"
            placeholder="Describe the neighborhood, amenities, and surroundings..."
            rows={4}
            value={formData.location_description || ''}
            onChange={handleLocationDescriptionChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
