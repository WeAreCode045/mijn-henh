
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { processXmlProperties } from "@/utils/xmlImport/xmlFileProcessor";

export interface XmlData {
  id: number | string;
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  status?: string;
  type?: string;
  images: string[];
  floorplans: string[];
  virtualTour?: string | null;
  youtubeUrl?: string | null;
  sourceFile?: string;
  originalXml: Element;
}

export function useXmlFileUpload() {
  const [xmlData, setXmlData] = useState<XmlData[] | null>(null);
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
          
          const parsedData = processXmlProperties(Array.from(properties));
          setXmlData(parsedData);
          showSuccessToast(parsedData.length);
        } else {
          // Process properties using the Result>RealEstateProperty structure
          const parsedData = processXmlProperties(Array.from(realEstateProperties));
          setXmlData(parsedData);
          showSuccessToast(parsedData.length);
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

  const showSuccessToast = (propertiesCount: number) => {
    setIsUploading(false);
    toast({
      title: "XML Uploaded Successfully",
      description: `Found ${propertiesCount} properties in the file.`,
    });
  };

  const resetXmlData = () => {
    setXmlData(null);
    setXmlFile(null);
  };

  return {
    xmlData,
    xmlFile,
    isUploading,
    handleFileUpload,
    resetXmlData,
    setXmlData
  };
}
