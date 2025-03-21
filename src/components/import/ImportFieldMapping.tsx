
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FieldMapper } from "./FieldMapper";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { preparePropertyDataForSubmission } from "@/hooks/property-form/utils/propertyDataFormatter";

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
    // Default mappings for common fields
  });
  
  const [isImporting, setIsImporting] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const xmlFields = Array.from(
    new Set(
      xmlData.flatMap(item => 
        Object.keys(item).filter(key => key !== "id" && key !== "originalXml")
      )
    )
  );

  const handleMappingChange = (propertyField: string, xmlField: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [propertyField]: xmlField,
    }));
  };

  const togglePropertySelection = (id: number) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(propId => propId !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === xmlData.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(xmlData.map(prop => prop.id));
    }
  };

  const importProperties = async () => {
    try {
      setIsImporting(true);
      
      // Filter only selected properties
      const propertiesToImport = xmlData.filter(prop => 
        selectedProperties.includes(prop.id)
      );
      
      if (propertiesToImport.length === 0) {
        toast({
          title: "No Properties Selected",
          description: "Please select at least one property to import.",
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }
      
      // Map XML fields to property fields based on the fieldMappings
      const mappedProperties = propertiesToImport.map(xmlProp => {
        const propertyData: Record<string, any> = {
          status: "Draft",
          metadata: { status: "Draft" },
        };
        
        // Apply field mappings
        for (const [propertyField, xmlField] of Object.entries(fieldMappings)) {
          if (xmlField && xmlProp[xmlField]) {
            propertyData[propertyField] = xmlProp[xmlField];
          }
        }
        
        return propertyData;
      });
      
      // Insert each property into the database
      const results = await Promise.all(
        mappedProperties.map(async (property) => {
          // Format the property data for submission
          const formattedData = preparePropertyDataForSubmission(property);
          
          // Insert into database
          const { data, error } = await supabase
            .from('properties')
            .insert(formattedData)
            .select();
            
          if (error) {
            console.error("Error importing property:", error);
            return { success: false, error };
          }
          
          return { success: true, data };
        })
      );
      
      // Count successful imports
      const successCount = results.filter(result => result.success).length;
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${successCount} out of ${propertiesToImport.length} properties.`,
        variant: successCount > 0 ? "default" : "destructive",
      });
      
      if (successCount > 0) {
        // Navigate to properties page after successful import
        setTimeout(() => navigate("/properties"), 2000);
      }
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the properties.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>
        <p className="text-sm text-gray-500 mb-4">
          Map the XML fields to the appropriate property fields in the system.
        </p>
        
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
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Properties to Import</h2>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllProperties}
              >
                {selectedProperties.length === xmlData.length ? "Deselect All" : "Select All"}
              </Button>
              <Button 
                onClick={importProperties} 
                disabled={isImporting || selectedProperties.length === 0}
              >
                {isImporting ? "Importing..." : `Import ${selectedProperties.length} Properties`}
              </Button>
            </div>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Bedrooms</TableHead>
              <TableHead>Bathrooms</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {xmlData.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <input 
                    type="checkbox"
                    checked={selectedProperties.includes(property.id)}
                    onChange={() => togglePropertySelection(property.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>{property.title}</TableCell>
                <TableCell>{property.price}</TableCell>
                <TableCell>{property.bedrooms}</TableCell>
                <TableCell>{property.bathrooms}</TableCell>
                <TableCell>{property.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
