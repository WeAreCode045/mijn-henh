
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  isReadOnly?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function PropertySpecs({ 
  formData, 
  onFieldChange,
  isReadOnly = false,
  setPendingChanges
}: PropertySpecsProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`PropertySpecs: Changing ${name} to ${value}`);
    if (onFieldChange) {
      onFieldChange(name as keyof PropertyFormData, value);
      if (setPendingChanges) {
        setPendingChanges(true);
      }
    } else {
      console.warn("PropertySpecs: onFieldChange is not defined");
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleChange}
              min={0}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              value={formData.bathrooms || ''}
              onChange={handleChange}
              min={0}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sqft">Total Area (m²)</Label>
            <Input
              id="sqft"
              name="sqft"
              type="number"
              placeholder="Total Area"
              value={formData.sqft || ''}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
