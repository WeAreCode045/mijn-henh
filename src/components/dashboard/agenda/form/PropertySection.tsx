
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertiesSelect } from "@/hooks/usePropertiesSelect";

interface PropertySectionProps {
  selectedPropertyId: string | null;
  setSelectedPropertyId: (value: string | null) => void;
}

export function PropertySection({
  selectedPropertyId,
  setSelectedPropertyId,
}: PropertySectionProps) {
  const { properties, isLoading: isPropertiesLoading } = usePropertiesSelect();
  
  // Ensure we have a safe value for the property id
  const safeSelectedPropertyId = selectedPropertyId || "none";

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="property" className="text-right">
        Property
      </Label>
      <Select
        value={safeSelectedPropertyId}
        onValueChange={(value) => setSelectedPropertyId(value === "none" ? null : value)}
        defaultValue="none"
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="No property (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No property</SelectItem>
          {properties.map((property) => (
            <SelectItem 
              key={property.id} 
              value={property.id || `property-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}
            >
              {property.title || `Property ${property.id.substring(0, 8)}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
