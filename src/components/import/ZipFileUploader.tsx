
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileArchive } from "lucide-react";
import JSZip from "jszip";
import { useToast } from "@/components/ui/use-toast";
import { processXmlProperties } from "@/utils/xmlImport/xmlFileProcessor";

interface ZipFileUploaderProps {
  onFilesProcessed: (data: any[]) => void;
}

export function ZipFileUploader({ onFilesProcessed }: ZipFileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a ZIP file.",
          variant: "destructive",
        });
      }
    }
  };

  const processZipFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const zipData = await selectedFile.arrayBuffer();
      const zip = await JSZip.loadAsync(zipData);
      
      let allProperties: any[] = [];
      
      // Process each XML file in the ZIP
      const xmlFiles = Object.values(zip.files).filter(file => 
        !file.dir && file.name.toLowerCase().endsWith('.xml')
      );
      
      if (xmlFiles.length === 0) {
        toast({
          title: "No XML files found",
          description: "The ZIP file doesn't contain any XML files.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      let processedCount = 0;
      
      for (const file of xmlFiles) {
        try {
          const xmlContent = await file.async("string");
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
          
          // Try to find RealEstateProperty elements
          const realEstateProperties = xmlDoc.querySelectorAll("Result RealEstateProperty");
          
          if (realEstateProperties.length > 0) {
            const parsedProperties = processXmlProperties(Array.from(realEstateProperties));
            
            // Add an identifier for the source file
            const propertiesWithSource = parsedProperties.map(prop => ({
              ...prop,
              sourceFile: file.name,
              id: prop.id + "_" + processedCount // Ensure unique IDs
            }));
            
            allProperties = [...allProperties, ...propertiesWithSource];
            processedCount += parsedProperties.length;
          } else {
            // Fallback to direct property elements
            const properties = xmlDoc.getElementsByTagName("property");
            if (properties.length > 0) {
              const parsedProperties = processXmlProperties(Array.from(properties));
              
              const propertiesWithSource = parsedProperties.map(prop => ({
                ...prop,
                sourceFile: file.name,
                id: prop.id + "_" + processedCount
              }));
              
              allProperties = [...allProperties, ...propertiesWithSource];
              processedCount += parsedProperties.length;
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      }
      
      if (allProperties.length > 0) {
        toast({
          title: "ZIP File Processed",
          description: `Found ${allProperties.length} properties across ${xmlFiles.length} XML files.`,
        });
        onFilesProcessed(allProperties);
      } else {
        toast({
          title: "No Properties Found",
          description: "No properties could be extracted from the XML files.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing ZIP file:", error);
      toast({
        title: "Error Processing ZIP",
        description: "Failed to process the ZIP file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="zip-file">ZIP File with XML Properties</Label>
        <Input 
          id="zip-file" 
          type="file" 
          accept=".zip"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>
      
      {selectedFile && (
        <div className="space-y-2">
          <p className="text-sm">Selected file: {selectedFile.name}</p>
          <Button 
            onClick={processZipFile} 
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <FileArchive className="h-4 w-4" />
                Process ZIP File
              </>
            )}
          </Button>
        </div>
      )}
      
      {!selectedFile && (
        <p className="text-sm text-gray-500">
          Please select a ZIP file containing multiple XML files with property data.
        </p>
      )}
    </div>
  );
}
