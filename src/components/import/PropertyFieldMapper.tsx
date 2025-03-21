
import { PropertyFieldList } from "./PropertyFieldList";
import { PropertyFieldPreview } from "./PropertyFieldPreview";

interface PropertyFieldMapperProps {
  fieldMappings: Record<string, string>;
  xmlFields: string[];
  xmlData: any[];
  handleMappingChange: (propertyField: string, xmlField: string) => void;
  includedFields: Record<string, boolean>;
  handleIncludeChange: (propertyField: string, include: boolean) => void;
}

export function PropertyFieldMapper({
  fieldMappings,
  xmlFields,
  xmlData,
  handleMappingChange,
  includedFields,
  handleIncludeChange
}: PropertyFieldMapperProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <PropertyFieldList 
          fieldMappings={fieldMappings}
          xmlFields={xmlFields}
          handleMappingChange={handleMappingChange}
          includedFields={includedFields}
          handleIncludeChange={handleIncludeChange}
        />
      </div>
      
      <div>
        <PropertyFieldPreview 
          xmlData={xmlData}
          fieldMappings={fieldMappings}
          includedFields={includedFields}
        />
      </div>
    </div>
  );
}
