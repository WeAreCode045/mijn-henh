
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onGeneralInfoChange: (section: string, field: string, value: any) => void;
}

export function BasicDetails({ formData, onFieldChange, onGeneralInfoChange }: BasicDetailsProps) {
  // Get values from generalInfo or fallback to direct properties for backwards compatibility
  const propertyDetails = formData.generalInfo?.propertyDetails || {
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Property Title"
            value={propertyDetails.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="Price"
            value={propertyDetails.price}
            onChange={(e) => handleChange('price', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Address"
            value={propertyDetails.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="objectId">Object ID</Label>
          <Input
            id="objectId"
            placeholder="Object ID"
            value={propertyDetails.objectId}
            onChange={(e) => handleChange('objectId', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
