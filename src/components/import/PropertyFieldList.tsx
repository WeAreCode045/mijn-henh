
import { FieldMapper } from "./FieldMapper";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PropertyFieldListProps {
  fieldMappings: Record<string, string>;
  xmlFields: string[];
  handleMappingChange: (propertyField: string, xmlField: string) => void;
  includedFields: Record<string, boolean>;
  handleIncludeChange: (propertyField: string, include: boolean) => void;
}

export function PropertyFieldList({
  fieldMappings,
  xmlFields,
  handleMappingChange,
  includedFields,
  handleIncludeChange
}: PropertyFieldListProps) {
  const propertyFields = [
    { id: "title", name: "Title" },
    { id: "description", name: "Description" },
    { id: "price", name: "Price" },
    { id: "address", name: "Address" },
    { id: "city", name: "City" },
    { id: "zipcode", name: "Zipcode" },
    { id: "country", name: "Country" },
    { id: "bedrooms", name: "Bedrooms" },
    { id: "bathrooms", name: "Bathrooms" },
    { id: "sqft", name: "Square Feet" },
    { id: "propertyType", name: "Property Type" },
    { id: "object_id", name: "Object ID" }
  ];

  return (
    <div className="space-y-4">
      {propertyFields.map((field) => (
        <div key={field.id} className="flex items-start gap-4">
          <div className="flex items-center h-10 pt-1">
            <Checkbox
              id={`include-${field.id}`}
              checked={includedFields[field.id] || false}
              onCheckedChange={(checked) => 
                handleIncludeChange(field.id, checked === true)
              }
            />
          </div>
          <div className="flex-1">
            <FieldMapper
              fieldName={field.name}
              fieldId={field.id}
              xmlFields={xmlFields}
              selectedField={fieldMappings[field.id] || "not_mapped"}
              onFieldChange={(value) => handleMappingChange(field.id, value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
