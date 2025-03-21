
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
    sqft: "sqft",
    livingArea: "livingArea",
    buildYear: "buildYear",
    energyLabel: "energyLabel",
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

  const downloadAndStoreImage = async (url: string, propertyId: string, isFloorplan: boolean = false): Promise<string | null> => {
    try {
      // Use the edge function to download and store the image
      const { data: { session } } = await supabase.auth.getSession();
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-image`;

      console.log(`Downloading ${isFloorplan ? 'floorplan' : 'image'} from URL:`, url);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ 
          imageUrl: url,
          propertyId,
          folder: isFloorplan ? 'floorplans' : 'photos'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to download image: ${errorData.error || response.statusText}`);
      }

      const { publicUrl, error } = await response.json();
      if (error) throw new Error(error);

      console.log(`Successfully downloaded and stored ${isFloorplan ? 'floorplan' : 'image'}:`, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error(`Error downloading/storing ${isFloorplan ? 'floorplan' : 'image'}:`, error);
      return null;
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
      
      // Import each property
      const results = await Promise.all(
        propertiesToImport.map(async (xmlProp) => {
          try {
            // Map XML fields to property fields based on the fieldMappings
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
            
            // Format the property data for submission
            const formattedData = preparePropertyDataForSubmission(propertyData);
            
            // Insert into database to get the property ID
            const { data, error } = await supabase
              .from('properties')
              .insert(formattedData)
              .select()
              .single();
              
            if (error) {
              console.error("Error importing property:", error);
              return { success: false, error };
            }
            
            const propertyId = data.id;
            
            // Process images
            if (xmlProp.images && xmlProp.images.length > 0) {
              const imageUrls = [];
              let featuredImage = null;
              
              for (const imageUrl of xmlProp.images) {
                const storedUrl = await downloadAndStoreImage(imageUrl, propertyId, false);
                if (storedUrl) {
                  imageUrls.push(storedUrl);
                  if (!featuredImage) {
                    featuredImage = storedUrl;
                  }
                  
                  // Create property_images record
                  await supabase.from('property_images').insert({
                    property_id: propertyId,
                    url: storedUrl,
                    type: 'image',
                    sort_order: imageUrls.length
                  });
                }
              }
              
              // Update property with images array and featured image
              if (imageUrls.length > 0) {
                await supabase
                  .from('properties')
                  .update({
                    featuredImage
                  })
                  .eq('id', propertyId);
              }
            }
            
            // Process floorplans
            if (xmlProp.floorplans && xmlProp.floorplans.length > 0) {
              for (const floorplanUrl of xmlProp.floorplans) {
                const storedUrl = await downloadAndStoreImage(floorplanUrl, propertyId, true);
                if (storedUrl) {
                  // Create property_floorplans record
                  await supabase.from('property_floorplans').insert({
                    property_id: propertyId,
                    url: storedUrl,
                    sort_order: 1
                  });
                }
              }
            }
            
            return { success: true, data };
          } catch (error) {
            console.error("Error processing property:", error);
            return { success: false, error };
          }
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
              <TableHead className="w-24">Images</TableHead>
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
                <TableCell>
                  {(property.images?.length || 0) + (property.floorplans?.length || 0)} files
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
