
import { PropertyFormData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropertySpecsProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function PropertySpecs({ formData, onFieldChange }: PropertySpecsProps) {
  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    onFieldChange(field, value);
  };
  
  const propertyTypes = [
    "House", "Apartment", "Townhouse", "Condo", "Land", "Commercial"
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Key Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {/* TYPE */}
          <div className="col-span-2">
            <Label htmlFor="property-type">Type</Label>
            <Select
              value={formData.type || ""}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* PRICE */}
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price || ""}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="e.g. $500,000"
            />
          </div>
          
          {/* BEDS */}
          <div>
            <Label htmlFor="beds">Beds</Label>
            <Input
              id="beds"
              type="number"
              min="0"
              value={formData.beds || ""}
              onChange={(e) => handleInputChange("beds", e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
          
          {/* BATHS */}
          <div>
            <Label htmlFor="baths">Baths</Label>
            <Input
              id="baths"
              type="number"
              min="0"
              step="0.5"
              value={formData.baths || ""}
              onChange={(e) => handleInputChange("baths", e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
          
          {/* GARAGES */}
          <div>
            <Label htmlFor="garages">Garages</Label>
            <Input
              id="garages"
              type="number"
              min="0"
              value={formData.garages || ""}
              onChange={(e) => handleInputChange("garages", e.target.value)}
              placeholder="e.g. 1"
            />
          </div>
          
          {/* SIZE */}
          <div>
            <Label htmlFor="size">Size (sq ft)</Label>
            <Input
              id="size"
              value={formData.size || ""}
              onChange={(e) => handleInputChange("size", e.target.value)}
              placeholder="e.g. 1,500"
            />
          </div>
          
          {/* LOT SIZE */}
          <div>
            <Label htmlFor="lot-size">Lot Size</Label>
            <Input
              id="lot-size"
              value={formData.lot_size || ""}
              onChange={(e) => handleInputChange("lot_size", e.target.value)}
              placeholder="e.g. 0.25 acres"
            />
          </div>
          
          {/* YEAR BUILT */}
          <div>
            <Label htmlFor="year-built">Year Built</Label>
            <Input
              id="year-built"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.year_built || ""}
              onChange={(e) => handleInputChange("year_built", e.target.value)}
              placeholder="e.g. 2005"
            />
          </div>
          
          {/* MLS ID */}
          <div className="col-span-2">
            <Label htmlFor="mls-id">MLS ID</Label>
            <Input
              id="mls-id"
              value={formData.mls_id || ""}
              onChange={(e) => handleInputChange("mls_id", e.target.value)}
              placeholder="e.g. MLS12345"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
