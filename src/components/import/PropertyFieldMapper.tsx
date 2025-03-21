
import { PropertyFieldList } from "./PropertyFieldList";
import { PropertyFieldPreview } from "./PropertyFieldPreview";

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
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <PropertyFieldList 
          fieldMappings={fieldMappings}
          xmlFields={xmlFields}
          handleMappingChange={handleMappingChange}
        />
      </div>
      
      <div>
        <PropertyFieldPreview 
          xmlData={xmlData}
          fieldMappings={fieldMappings}
        />
      </div>
    </div>
  );
}
