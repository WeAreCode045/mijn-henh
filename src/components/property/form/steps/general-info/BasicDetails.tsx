
import { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  isReadOnly?: boolean;
  setPendingChanges?: (pending: boolean) => void;
}

export function BasicDetails({ 
  formData, 
  onFieldChange,
  isReadOnly = false,
  setPendingChanges
}: BasicDetailsProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`BasicDetails: Changing ${name} to ${value}`);
    onFieldChange(name as keyof PropertyFormData, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  const handleSelectChange = (field: string, value: string) => {
    console.log(`BasicDetails: Changing ${field} to ${value}`);
    onFieldChange(field as keyof PropertyFormData, value);
    if (setPendingChanges) {
      setPendingChanges(true);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Basic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Property Title"
            value={formData.title || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue={formData.status || 'for_sale'} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for_sale">For Sale</SelectItem>
                <SelectItem value="for_rent">For Rent</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="off_market">Off Market</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select 
              defaultValue={formData.propertyType || 'house'} 
              onValueChange={(value) => handleSelectChange('propertyType', value)}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
