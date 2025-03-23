
import { PropertyFormData } from "@/types/property";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DescriptionSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  isReadOnly?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function DescriptionSection({ 
  formData, 
  onFieldChange,
  isReadOnly = false,
  setPendingChanges
}: DescriptionSectionProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`DescriptionSection: Changing ${name} to: `, value);
    onFieldChange(name as keyof PropertyFormData, value);
    
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            placeholder="Provide a short description for this property"
            value={formData.shortDescription || ''}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide a detailed description for this property"
            value={formData.description || ''}
            onChange={handleChange}
            className="min-h-[160px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
