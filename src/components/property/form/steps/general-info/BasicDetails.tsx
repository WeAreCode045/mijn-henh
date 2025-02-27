
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PropertyFormData } from "@/types/property";

interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function BasicDetails({ formData, onFieldChange }: BasicDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={formData.title || ''}
          onChange={(e) => {
            console.log("Title changed to:", e.target.value);
            onFieldChange('title', e.target.value);
          }}
          placeholder="Title"
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="text"
          value={formData.price || ''}
          onChange={(e) => {
            console.log("Price changed to:", e.target.value);
            onFieldChange('price', e.target.value);
          }}
          placeholder="Price"
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          value={formData.address || ''}
          onChange={(e) => onFieldChange('address', e.target.value)}
          placeholder="Address"
        />
      </div>
      <div>
        <Label htmlFor="object_id">Object ID</Label>
        <Input
          id="object_id"
          type="text"
          value={formData.object_id || ''}
          onChange={(e) => onFieldChange('object_id', e.target.value)}
          placeholder="Object ID"
        />
      </div>
    </div>
  );
}
