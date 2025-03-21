
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
        
        // Try to find RealEstateProperty elements based on the provided path
        const realEstateProperties = xmlDoc.querySelectorAll("Result RealEstateProperty");
        
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
          // Process properties using the Result>RealEstateProperty structure
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

  const extractXmlValue = (property: Element, path: string) => {
    try {
      // Split the path and navigate through the XML structure
      const segments = path.split('/').filter(s => s.trim() !== '');
      let currentElement: Element | null = property;
      
      for (const segment of segments) {
        if (!currentElement) return "";
        
        // Handle attribute selectors (e.g., @Language)
        if (segment.startsWith('@')) {
          const attrName = segment.substring(1);
          return currentElement.getAttribute(attrName) || "";
        }
        
        // Get child elements
        const elements = currentElement.getElementsByTagName(segment);
        if (elements.length === 0) {
          currentElement = null;
        } else {
          currentElement = elements[0];
        }
      }
      
      return currentElement ? currentElement.textContent?.trim() || "" : "";
    } catch (error) {
      console.error("Error extracting value from path:", path, error);
      return "";
    }
  };

  const processProperties = (properties: Element[]) => {
    // Create a structured representation of the XML data
    const parsedData = properties.map((prop, index) => {
      // Define the specific XML paths for our property data
      const addressPath = "LocationDetails/GeoAddressDetails/FormattedAddress";
      const pricePath = "Financials/PurchasePrice";
      const descriptionPath = "Descriptions/AdText/Translation";
      const buildYearPath = "Construction/ConstructionYearFrom";
      const lotSizePath = "Dimensions/Land/Area";
      const livingAreaPath = "AreaTotals/EffectiveArea";
      const bedroomsPath = "Counts/CountOfBedrooms";
      const bathroomsPath = "Counts/CountOfBathrooms";
      const energyClassPath = "ClimatControl/EnergyCertificate/EnergyClass";
      
      // Extract data using the correct paths
      const address = extractXmlValue(prop, addressPath);
      const price = extractXmlValue(prop, pricePath);
      const description = extractXmlValue(prop, descriptionPath);
      const buildYear = extractXmlValue(prop, buildYearPath);
      const lotSize = extractXmlValue(prop, lotSizePath);
      const livingArea = extractXmlValue(prop, livingAreaPath);
      const bedrooms = extractXmlValue(prop, bedroomsPath);
      const bathrooms = extractXmlValue(prop, bathroomsPath);
      const energyClass = extractXmlValue(prop, energyClassPath);
      
      // Extract attachments (images and floorplans)
      const attachments = prop.querySelectorAll("Attachments Attachment");
      const images: string[] = [];
      const floorplans: string[] = [];
      
      attachments.forEach(attachment => {
        const url = attachment.querySelector("URLNormalizedFile")?.textContent || "";
        const type = attachment.querySelector("Type")?.textContent || "";
        
        if (url) {
          if (type.toLowerCase().includes("floorplan")) {
            floorplans.push(url);
          } else {
            images.push(url);
          }
        }
      });
      
      // Process backups if the specific paths don't work
      const extractValue = (tagName: string) => {
        const element = prop.getElementsByTagName(tagName)[0];
        return element ? element.textContent : "";
      };
      
      return {
        id: index,
        title: address || extractValue("title") || extractValue("Title"),
        price: price || extractValue("price") || extractValue("Price"),
        address: address || extractValue("address") || extractValue("Address") || extractValue("location") || extractValue("Location"),
        bedrooms: bedrooms || extractValue("bedrooms") || extractValue("Bedrooms") || extractValue("beds") || extractValue("Beds"),
        bathrooms: bathrooms || extractValue("bathrooms") || extractValue("Bathrooms") || extractValue("baths") || extractValue("Baths"),
        description: description || extractValue("description") || extractValue("Description"),
        sqft: lotSize || extractValue("sqft") || extractValue("Sqft") || extractValue("size") || extractValue("Size"),
        livingArea: livingArea || extractValue("livingArea") || extractValue("LivingArea"),
        buildYear: buildYear || extractValue("buildYear") || extractValue("BuildYear") || extractValue("YearBuilt"),
        garages: extractValue("garages") || extractValue("Garages"),
        energyLabel: energyClass || extractValue("energyLabel") || extractValue("EnergyLabel"),
        images: images,
        floorplans: floorplans,
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
