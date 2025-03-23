
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function PropertySpecs({ formData, onFieldChange, setPendingChanges }: PropertySpecsProps) {
  const handleChange = (field: keyof PropertyFormData, value: string) => {
    console.log(`PropertySpecs change: ${String(field)} = ${value}`);
    onFieldChange(field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    handleChange(id as keyof PropertyFormData, value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Field - Added this field */}
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleInputChange}
              placeholder="No. of bedrooms"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              value={formData.bathrooms || ''}
              onChange={handleInputChange}
              placeholder="No. of bathrooms"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sqft">Plot Area (m²)</Label>
            <Input
              id="sqft"
              value={formData.sqft || ''}
              onChange={handleInputChange}
              placeholder="Plot area"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="livingArea">Living Area (m²)</Label>
            <Input
              id="livingArea"
              value={formData.livingArea || ''}
              onChange={handleInputChange}
              placeholder="Living area"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buildYear">Build Year</Label>
            <Input
              id="buildYear"
              value={formData.buildYear || ''}
              onChange={handleInputChange}
              placeholder="Year built"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energyLabel">Energy Label</Label>
            <Select 
              value={formData.energyLabel || 'not_specified'} 
              onValueChange={(value) => handleChange('energyLabel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select energy label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_specified">Not specified</SelectItem>
                <SelectItem value="A+++">A+++</SelectItem>
                <SelectItem value="A++">A++</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="F">F</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
