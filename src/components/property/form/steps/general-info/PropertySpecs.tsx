
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
  // Access keyInformation fields from generalInfo, with fallbacks
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

  const propertyType = formData.propertyType || '';

  const handleChange = (field: string, value: any) => {
    if (onGeneralInfoChange) {
      onGeneralInfoChange('keyInformation', field, value);
    } else if (onFieldChange) {
      if (field === 'buildYear') onFieldChange('buildYear', value);
      if (field === 'lotSize') onFieldChange('sqft', value);
      if (field === 'livingArea') onFieldChange('livingArea', value);
      if (field === 'bedrooms') onFieldChange('bedrooms', value);
      if (field === 'bathrooms') onFieldChange('bathrooms', value);
      if (field === 'energyClass') onFieldChange('energyLabel', value);
      if (field === 'garages') onFieldChange('garages', value);
      if (field === 'hasGarden') onFieldChange('hasGarden', value);
    }
  };

  const handlePropertyTypeChange = (value: string) => {
    if (onFieldChange) {
      onFieldChange('propertyType', value);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="bungalow">Bungalow</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="detached">Detached</SelectItem>
                  <SelectItem value="semi-detached">Semi-detached</SelectItem>
                  <SelectItem value="corner-house">Corner House</SelectItem>
                  <SelectItem value="terraced">Terraced</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buildYear">Build Year</Label>
              <Input
                id="buildYear"
                value={keyInfo.buildYear}
                onChange={(e) => handleChange('buildYear', e.target.value)}
                placeholder="Year built"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lotSize">Lot Size (sqm)</Label>
              <Input
                id="lotSize"
                value={keyInfo.lotSize}
                onChange={(e) => handleChange('lotSize', e.target.value)}
                placeholder="Lot size in sqm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="livingArea">Living Area (sqm)</Label>
              <Input
                id="livingArea"
                value={keyInfo.livingArea}
                onChange={(e) => handleChange('livingArea', e.target.value)}
                placeholder="Living area in sqm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                value={keyInfo.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                placeholder="Number of bedrooms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                value={keyInfo.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                placeholder="Number of bathrooms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="energyClass">Energy Class</Label>
              <Select value={keyInfo.energyClass} onValueChange={(value) => handleChange('energyClass', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select energy class" />
                </SelectTrigger>
                <SelectContent>
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
            
            <div className="space-y-2">
              <Label htmlFor="garages">Garages</Label>
              <Input
                id="garages"
                value={keyInfo.garages}
                onChange={(e) => handleChange('garages', e.target.value)}
                placeholder="Number of garages"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="hasGarden"
                checked={keyInfo.hasGarden}
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
