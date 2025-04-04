
import { PropertyFormData } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({ formData, onFieldChange, setPendingChanges }: DescriptionSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
    
    // If setPendingChanges is provided, update pending changes status
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
          <Textarea
            id="shortDescription"
            name="shortDescription"
            placeholder="Enter a brief summary of the property (displayed in listings)"
            value={formData.shortDescription || ''}
            onChange={handleChange}
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter a detailed description of the property"
            value={formData.description || ''}
            onChange={handleChange}
            className="min-h-[200px]"
            rows={8}
          />
        </div>
      </CardContent>
    </Card>
  );
}
