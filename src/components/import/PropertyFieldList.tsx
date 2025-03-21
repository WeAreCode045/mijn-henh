
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
    { id: "object_id", label: "Property ID" },
    { id: "virtualTourUrl", label: "Virtual Tour URL" },
    { id: "youtubeUrl", label: "YouTube URL" },
    { id: "status", label: "Status" },
    { id: "propertyType", label: "Property Type" }, // Changed from "type" to "propertyType"
  ];

  return (
    <div>
      <h3 className="font-medium mb-2">Map XML Fields to Property Fields</h3>
      <div className="flex items-center mb-4">
        <Label className="text-sm text-gray-500">Field</Label>
        <Label className="text-sm text-gray-500 ml-auto mr-8">Include</Label>
      </div>
      <div className="space-y-3">
        {propertyFields.map(field => (
          <div key={field.id} className="flex items-center">
            <div className="flex-1">
              <FieldMapper
                fieldName={field.label}
                fieldId={field.id}
                xmlFields={xmlFields}
                selectedField={fieldMappings[field.id] || "not_mapped"}
                onFieldChange={(xmlField) => handleMappingChange(field.id, xmlField === "not_mapped" ? "" : xmlField)}
              />
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <Checkbox 
                id={`include-${field.id}`}
                checked={includedFields[field.id] !== false}
                onCheckedChange={(checked) => handleIncludeChange(field.id, checked as boolean)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
