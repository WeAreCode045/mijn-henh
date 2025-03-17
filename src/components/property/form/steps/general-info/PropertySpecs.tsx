
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PropertyFormData } from "@/types/property";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange?: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange?: (section: string, field: string, value: any) => void;
}

export function PropertySpecs({
  formData,
  onFieldChange,
  onGeneralInfoChange
}: PropertySpecsProps) {
  const keyInfo = formData.generalInfo?.keyInformation || {
    buildYear: formData.buildYear || '',
    lotSize: formData.sqft || '',
    livingArea: formData.livingArea || '',
    bedrooms: formData.bedrooms || '',
    bathrooms: formData.bathrooms || '',
    energyClass: formData.energyLabel || '',
    garages: formData.garages || '',
    hasGarden: formData.hasGarden || false,
    propertyType: formData.propertyType || ''
  };

  const handleChange = (field: string, value: any) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', field, value);
    } else if (onFieldChange) {
      // Map general info fields to property data fields
      const fieldMap: Record<string, keyof PropertyFormData> = {
        buildYear: 'buildYear',
        lotSize: 'sqft',
        livingArea: 'livingArea',
        bedrooms: 'bedrooms',
        bathrooms: 'bathrooms',
        energyClass: 'energyLabel',
        garages: 'garages',
        hasGarden: 'hasGarden',
        propertyType: 'propertyType'
      };
      
      const propertyField = fieldMap[field] as keyof PropertyFormData;
      if (propertyField) {
        onFieldChange(propertyField, value);
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Key Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={keyInfo.propertyType || ""}
                onValueChange={(value) => handleChange('propertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="bungalow">Bungalow</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="detached">Detached House</SelectItem>
                  <SelectItem value="semidetached">Semi-detached House</SelectItem>
                  <SelectItem value="cornerhouse">Corner House</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="farmhouse">Farmhouse</SelectItem>
                  <SelectItem value="cottage">Cottage</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="buildYear">Build Year</Label>
              <Input
                id="buildYear"
                value={keyInfo.buildYear || ""}
                onChange={(e) => handleChange('buildYear', e.target.value)}
                placeholder="E.g. 1995"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lotSize">Lot Size (m²)</Label>
              <Input
                id="lotSize"
                value={keyInfo.lotSize || ""}
                onChange={(e) => handleChange('lotSize', e.target.value)}
                placeholder="E.g. 250"
              />
            </div>
            
            <div>
              <Label htmlFor="livingArea">Living Area (m²)</Label>
              <Input
                id="livingArea"
                value={keyInfo.livingArea || ""}
                onChange={(e) => handleChange('livingArea', e.target.value)}
                placeholder="E.g. 120"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                value={keyInfo.bedrooms || ""}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                placeholder="E.g. 3"
              />
            </div>
            
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                value={keyInfo.bathrooms || ""}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                placeholder="E.g. 2"
              />
            </div>
            
            <div>
              <Label htmlFor="garages">Garages</Label>
              <Input
                id="garages"
                value={keyInfo.garages || ""}
                onChange={(e) => handleChange('garages', e.target.value)}
                placeholder="E.g. 1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <Label htmlFor="energyClass">Energy Label</Label>
              <Select
                value={keyInfo.energyClass || ""}
                onValueChange={(value) => handleChange('energyClass', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select energy label" />
                </SelectTrigger>
                <SelectContent>
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
            
            <div className="flex items-center space-x-2">
              <Switch
                id="hasGarden"
                checked={keyInfo.hasGarden || false}
                onCheckedChange={(checked) => handleChange('hasGarden', checked)}
              />
              <Label htmlFor="hasGarden">Has Garden</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
