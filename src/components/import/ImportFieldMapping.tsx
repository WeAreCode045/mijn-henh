
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFieldMapper } from "./PropertyFieldMapper";
import { PropertySelectionTable } from "./PropertySelectionTable";
import { usePropertyImport } from "@/hooks/import/usePropertyImport";

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
    // Default mappings for common fields
  });
  
  // Get all XML fields from the data
  const xmlFields = Array.from(
    new Set(
      xmlData.flatMap(item => 
        Object.keys(item).filter(key => 
          key !== "id" && 
          key !== "originalXml" && 
          key !== "images" && 
          key !== "floorplans"
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

  const {
    isImporting,
    selectedProperties,
    togglePropertySelection,
    selectAllProperties,
    importProperties
  } = usePropertyImport({ 
    xmlData, 
    fieldMappings: Object.fromEntries(
      Object.entries(fieldMappings).filter(([_, value]) => value !== "not_mapped" && value !== "")
    ) 
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>
        <p className="text-sm text-gray-500 mb-4">
          Map the XML fields to the appropriate property fields in the system.
        </p>
        
        <PropertyFieldMapper 
          fieldMappings={fieldMappings}
          xmlFields={xmlFields}
          xmlData={xmlData}
          handleMappingChange={handleMappingChange}
        />
      </div>
      
      <PropertySelectionTable 
        xmlData={xmlData}
        selectedProperties={selectedProperties}
        togglePropertySelection={togglePropertySelection}
        selectAllProperties={selectAllProperties}
        importProperties={importProperties}
        isImporting={isImporting}
      />
    </div>
  );
}
