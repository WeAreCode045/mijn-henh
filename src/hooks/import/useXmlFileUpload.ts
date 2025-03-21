
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { processXmlProperties } from "@/utils/xmlImport/xmlFileProcessor";
import { supabase } from "@/integrations/supabase/client";

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
  propertyId?: string;
  originalXml: Element;
  existsInDatabase?: boolean;
}

export function useXmlFileUpload() {
  const [xmlData, setXmlData] = useState<XmlData[] | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const checkExistingPropertyIds = async (properties: XmlData[]): Promise<XmlData[]> => {
    // Extract all property IDs
    const propertyIds = properties
      .filter(prop => prop.propertyId)
      .map(prop => prop.propertyId);
    
    if (propertyIds.length === 0) return properties;
    
    // Check which IDs already exist in the database
    const { data: existingProperties } = await supabase
      .from('properties')
      .select('object_id')
      .in('object_id', propertyIds);
    
    // Create a set of existing IDs for faster lookup
    const existingIds = new Set(existingProperties?.map(p => p.object_id) || []);
    
    // Mark properties that already exist in the database
    const updatedProperties = properties.map(property => ({
      ...property,
      existsInDatabase: property.propertyId ? existingIds.has(property.propertyId) : false
    }));
    
    // Show warning if any property already exists
    const existingCount = updatedProperties.filter(p => p.existsInDatabase).length;
    if (existingCount > 0) {
      toast({
        title: "Warning: Duplicate Properties Found",
        description: `${existingCount} properties in this XML file already exist in your database.`,
        variant: "destructive", // Changed from "warning" to "destructive"
      });
    }
    
    return updatedProperties;
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setXmlFile(file);
      
      // Parse XML file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target?.result as string, "application/xml");
        
        // Try to find RealEstateProperty elements based on the provided path
        const realEstateProperties = xmlDoc.querySelectorAll("Result RealEstateProperty");
        
        let parsedData: XmlData[] = [];
        
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
          
          parsedData = processXmlProperties(Array.from(properties));
        } else {
          // Process properties using the Result>RealEstateProperty structure
          parsedData = processXmlProperties(Array.from(realEstateProperties));
        }
        
        // Check for existing property IDs
        const dataWithExistingFlags = await checkExistingPropertyIds(parsedData);
        
        setXmlData(dataWithExistingFlags);
        showSuccessToast(dataWithExistingFlags.length);
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
