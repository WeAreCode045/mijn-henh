
import { FieldMapper } from "./FieldMapper";

interface PropertyFieldMapperProps {
  fieldMappings: Record<string, string>;
  xmlFields: string[];
  xmlData: any[];
  handleMappingChange: (propertyField: string, xmlField: string) => void;
}

export function PropertyFieldMapper({
  fieldMappings,
  xmlFields,
  xmlData,
  handleMappingChange
}: PropertyFieldMapperProps) {
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
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium mb-2">Map XML Fields to Property Fields</h3>
        <div className="space-y-3">
          {propertyFields.map(field => (
            <FieldMapper
              key={field.id}
              fieldName={field.label}
              fieldId={field.id}
              xmlFields={xmlFields}
              selectedField={fieldMappings[field.id] || ""}
              onFieldChange={(xmlField) => handleMappingChange(field.id, xmlField)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Preview (First Property)</h3>
        {xmlData.length > 0 && (
          <div className="border rounded p-4 text-sm">
            {Object.entries(fieldMappings)
              .filter(([_, xmlField]) => xmlField && xmlData[0][xmlField])
              .map(([propertyField, xmlField]) => (
                <div key={propertyField} className="mb-2">
                  <strong>{propertyField}:</strong> {xmlData[0][xmlField]}
                </div>
              ))}
            {xmlData[0].images && xmlData[0].images.length > 0 && (
              <div className="mb-2">
                <strong>Images:</strong> {xmlData[0].images.length} images available
              </div>
            )}
            {xmlData[0].floorplans && xmlData[0].floorplans.length > 0 && (
              <div className="mb-2">
                <strong>Floorplans:</strong> {xmlData[0].floorplans.length} floorplans available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
