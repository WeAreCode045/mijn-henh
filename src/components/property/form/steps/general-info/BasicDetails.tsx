
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface BasicDetailsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  setPendingChanges?: (pending: boolean) => void;
}

export function BasicDetails({ formData, onFieldChange, setPendingChanges }: BasicDetailsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFieldChange(name as keyof PropertyFormData, value);
    if (setPendingChanges) setPendingChanges(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    onFieldChange(name as keyof PropertyFormData, value);
    if (setPendingChanges) setPendingChanges(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Object ID */}
          <div>
            <Label htmlFor="object_id">Object ID (reference)</Label>
            <Input
              id="object_id"
              name="object_id"
              value={formData.object_id || ''}
              onChange={handleInputChange}
              placeholder="e.g. 12345"
            />
          </div>
          
          {/* Property Type */}
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType || 'not_selected'}
              onValueChange={(value) => handleSelectChange('propertyType', value)}
              defaultValue="not_selected"
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_selected">Select type...</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'not_selected'}
              onValueChange={(value) => handleSelectChange('status', value)}
              defaultValue="not_selected"
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_selected">Select status...</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
