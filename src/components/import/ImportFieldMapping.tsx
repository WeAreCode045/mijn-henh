
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFieldMapper } from "./PropertyFieldMapper";
import { PropertySelectionTable } from "./PropertySelectionTable";
import { usePropertyImport } from "@/hooks/import/property-import";

interface ImportFieldMappingProps {
  xmlData: any[];
}

export function ImportFieldMapping({ xmlData }: ImportFieldMappingProps) {
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({
    title: "title",
    price: "price",
    address: "address",
    bedrooms: "bedrooms",
    bathrooms: "bathrooms",
    description: "description",
    sqft: "sqft",
    livingArea: "livingArea",
    buildYear: "buildYear",
    energyLabel: "energyLabel",
    object_id: "propertyId", // Default for PropertyID
    // Default mappings for common fields
  });
  
  const [includedFields, setIncludedFields] = useState<Record<string, boolean>>({});
  
  // Get all XML fields from the data
  const xmlFields = Array.from(
    new Set(
      xmlData.flatMap(item => 
        Object.keys(item).filter(key => 
          key !== "originalXml" && 
          key !== "images" && 
          key !== "floorplans" &&
          key !== "virtualTour" &&
          key !== "youtubeUrl"
        )
      )
    )
  );

  const handleMappingChange = (propertyField: string, xmlField: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [propertyField]: xmlField,
    }));
  };

  const handleIncludeChange = (propertyField: string, include: boolean) => {
    setIncludedFields(prev => ({
      ...prev,
      [propertyField]: include,
    }));
  };

  const {
    isImporting,
    selectedProperties,
    togglePropertySelection,
    selectAllProperties,
    importProperties
  } = usePropertyImport({ 
    xmlData, 
    fieldMappings: Object.fromEntries(
      Object.entries(fieldMappings)
        .filter(([propertyField, value]) => 
          value !== "not_mapped" && 
          value !== "" && 
          includedFields[propertyField] !== false
        )
    ) 
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>
        <p className="text-sm text-gray-500 mb-4">
          Map the XML fields to the appropriate property fields in the system. Check the fields you want to include in the import.
        </p>
        
        <PropertyFieldMapper 
          fieldMappings={fieldMappings}
          xmlFields={xmlFields}
          xmlData={xmlData}
          handleMappingChange={handleMappingChange}
          includedFields={includedFields}
          handleIncludeChange={handleIncludeChange}
        />
      </div>
      
      <PropertySelectionTable 
        properties={xmlData}
        selectedProperties={selectedProperties}
        togglePropertySelection={togglePropertySelection}
        selectAllProperties={selectAllProperties}
        importProperties={importProperties}
        isImporting={isImporting}
      />
    </div>
  );
}
