
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
    onFieldChange(field, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
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
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Enter price"
          />
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              value={formData.bedrooms || ''}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="No. of bedrooms"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              value={formData.bathrooms || ''}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
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
              onChange={(e) => handleChange('sqft', e.target.value)}
              placeholder="Plot area"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="livingArea">Living Area (m²)</Label>
            <Input
              id="livingArea"
              value={formData.livingArea || ''}
              onChange={(e) => handleChange('livingArea', e.target.value)}
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
              onChange={(e) => handleChange('buildYear', e.target.value)}
              placeholder="Year built"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energyLabel">Energy Label</Label>
            <Select 
              value={formData.energyLabel || ''} 
              onValueChange={(value) => handleChange('energyLabel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select energy label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not specified</SelectItem>
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
