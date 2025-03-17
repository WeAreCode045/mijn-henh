
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange: (section: string, field: string, value: any) => void;
}

export function BasicDetails({
  formData,
  onFieldChange,
  onGeneralInfoChange
}: BasicDetailsProps) {
  // Access propertyDetails fields from generalInfo
  const details = formData.generalInfo?.propertyDetails || {
    title: formData.title || '',
    price: formData.price || '',
    address: formData.address || '',
    objectId: formData.object_id || ''
  };

  const handleChange = (field: string, value: string) => {
    onGeneralInfoChange('propertyDetails', field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={details.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Property title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={details.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="Property price"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={details.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Property address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="objectId">Object ID</Label>
          <Input
            id="objectId"
            value={details.objectId}
            onChange={(e) => handleChange('objectId', e.target.value)}
            placeholder="Object ID"
          />
        </div>
      </CardContent>
    </Card>
  );
}
