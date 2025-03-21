
import { FieldMapper } from "./FieldMapper";

interface PropertyFieldListProps {
  fieldMappings: Record<string, string>;
  xmlFields: string[];
  handleMappingChange: (propertyField: string, xmlField: string) => void;
}

export function PropertyFieldList({
  fieldMappings,
  xmlFields,
  handleMappingChange
}: PropertyFieldListProps) {
  const propertyFields = [
    { id: "title", label: "Title" },
    { id: "price", label: "Price" },
    { id: "address", label: "Address" },
    { id: "bedrooms", label: "Bedrooms" },
    { id: "bathrooms", label: "Bathrooms" },
    { id: "sqft", label: "Square Feet" },
    { id: "livingArea", label: "Living Area" },
    { id: "buildYear", label: "Build Year" },
    { id: "garages", label: "Garages" },
    { id: "energyLabel", label: "Energy Label" },
    { id: "description", label: "Description" },
    { id: "location_description", label: "Location Description" },
  ];

  return (
    <div>
      <h3 className="font-medium mb-2">Map XML Fields to Property Fields</h3>
      <div className="space-y-3">
        {propertyFields.map(field => (
          <FieldMapper
            key={field.id}
            fieldName={field.label}
            fieldId={field.id}
            xmlFields={xmlFields}
            selectedField={fieldMappings[field.id] || "not_mapped"}
            onFieldChange={(xmlField) => handleMappingChange(field.id, xmlField === "not_mapped" ? "" : xmlField)}
          />
        ))}
      </div>
    </div>
  );
}
