
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange: (section: string, field: string, value: any) => void;
}

export function PropertySpecs({
  formData,
  onFieldChange,
  onGeneralInfoChange
}: PropertySpecsProps) {
  // Access keyInformation from generalInfo
  const keyInfo = formData.generalInfo?.keyInformation || {
    buildYear: formData.buildYear || '',
    lotSize: formData.sqft || '',
    livingArea: formData.livingArea || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    energyClass: formData.energyLabel || '',
    garages: formData.garages || '',
    hasGarden: formData.hasGarden || false
  };

  // Handler for regular inputs
  const handleInputChange = (field: string, value: string) => {
    onGeneralInfoChange('keyInformation', field, value);
  };

  // Handler for garden switch
  const handleGardenChange = (checked: boolean) => {
    onGeneralInfoChange('keyInformation', 'hasGarden', checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buildYear">Build Year</Label>
            <Input 
              id="buildYear"
              value={keyInfo.buildYear}
              onChange={(e) => handleInputChange('buildYear', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size (m²)</Label>
            <Input 
              id="lotSize"
              value={keyInfo.lotSize}
              onChange={(e) => handleInputChange('lotSize', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="livingArea">Living Area (m²)</Label>
            <Input 
              id="livingArea"
              value={keyInfo.livingArea}
              onChange={(e) => handleInputChange('livingArea', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input 
              id="bedrooms"
              value={keyInfo.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input 
              id="bathrooms"
              value={keyInfo.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="garages">Garages</Label>
            <Input 
              id="garages"
              value={keyInfo.garages}
              onChange={(e) => handleInputChange('garages', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="energyClass">Energy Class</Label>
            <select
              id="energyClass"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={keyInfo.energyClass}
              onChange={(e) => handleInputChange('energyClass', e.target.value)}
            >
              <option value="">Select Energy Class</option>
              <option value="A+++">A+++</option>
              <option value="A++">A++</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="hasGarden"
              checked={!!keyInfo.hasGarden}
              onCheckedChange={handleGardenChange}
            />
            <Label htmlFor="hasGarden">Has Garden</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
