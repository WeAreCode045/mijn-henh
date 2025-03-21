
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportFieldMapping } from "@/components/import/ImportFieldMapping";
import { XmlFileUploader } from "@/components/import/XmlFileUploader";

export default function Import() {
  const [xmlData, setXmlData] = useState<any>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setXmlFile(file);
      
      // Parse XML file
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target?.result as string, "application/xml");
        
        // Navigate through Object>Result>RealEstateProperty structure
        const realEstateProperties = xmlDoc.querySelectorAll("Object Result RealEstateProperty");
        
        if (realEstateProperties.length === 0) {
          // Fallback: Try direct property elements if the structure doesn't match
          const properties = xmlDoc.getElementsByTagName("property");
          if (properties.length === 0) {
            toast({
              title: "No Properties Found",
              description: "The XML file doesn't contain properties in the expected format.",
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          }
          
          processProperties(Array.from(properties));
        } else {
          // Process properties using the Object>Result>RealEstateProperty structure
          processProperties(Array.from(realEstateProperties));
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading XML file:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error processing the XML file.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const processProperties = (properties: Element[]) => {
    // Create a structured representation of the XML data
    const parsedData = properties.map((prop, index) => {
      const extractValue = (tagName: string) => {
        const element = prop.getElementsByTagName(tagName)[0];
        return element ? element.textContent : "";
      };
      
      return {
        id: index,
        title: extractValue("title") || extractValue("Title"),
        price: extractValue("price") || extractValue("Price"),
        address: extractValue("address") || extractValue("Address") || extractValue("location") || extractValue("Location"),
        bedrooms: extractValue("bedrooms") || extractValue("Bedrooms") || extractValue("beds") || extractValue("Beds"),
        bathrooms: extractValue("bathrooms") || extractValue("Bathrooms") || extractValue("baths") || extractValue("Baths"),
        description: extractValue("description") || extractValue("Description"),
        sqft: extractValue("sqft") || extractValue("Sqft") || extractValue("size") || extractValue("Size"),
        livingArea: extractValue("livingArea") || extractValue("LivingArea"),
        buildYear: extractValue("buildYear") || extractValue("BuildYear") || extractValue("YearBuilt"),
        garages: extractValue("garages") || extractValue("Garages"),
        energyLabel: extractValue("energyLabel") || extractValue("EnergyLabel"),
        // Add other common property fields
        originalXml: prop,
      };
    });
    
    setXmlData(parsedData);
    setIsUploading(false);
    
    toast({
      title: "XML Uploaded Successfully",
      description: `Found ${parsedData.length} properties in the file.`,
    });
  };

  const handleContinueToMapping = () => {
    // Find the tab trigger for mapping and click it
    const mapTabTrigger = document.querySelector('[data-value="map"]') as HTMLElement;
    if (mapTabTrigger) {
      mapTabTrigger.click();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Import Properties</h1>
      </div>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload">Upload XML</TabsTrigger>
          <TabsTrigger value="map" disabled={!xmlData}>Map Fields</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload XML File</CardTitle>
              <CardDescription>
                Upload an XML file containing property data to import into the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <XmlFileUploader onFileUpload={handleFileUpload} isUploading={isUploading} />
              
              {xmlData && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Found {xmlData.length} properties in the file.
                  </p>
                  <Button onClick={handleContinueToMapping}>
                    Continue to Field Mapping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          {xmlData && <ImportFieldMapping xmlData={xmlData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
