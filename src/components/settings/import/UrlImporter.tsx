
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { processZipFile } from "./ZipProcessor";
import { processXmlContent } from "./XmlProcessor";
import { AgencySettings } from "@/types/agency";

interface UrlImporterProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UrlImporter({ settings, onChange }: UrlImporterProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const importProperties = async () => {
    try {
      if (!settings.xmlImportUrl) {
        toast({
          title: "Error",
          description: "Please provide a ZIP file URL",
          variant: "destructive",
        });
        return;
      }

      if (!settings.xmlImportUrl.endsWith('.zip')) {
        toast({
          title: "Error",
          description: "Only ZIP files are supported",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      const response = await fetch(settings.xmlImportUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch ZIP file');
      }

      const buffer = await response.arrayBuffer();
      const filename = settings.xmlImportUrl.split('/').pop() || 
        `download_${new Date().toISOString()}.zip`;

      const { xmlFiles, uploadedFiles } = await processZipFile(buffer, filename);
      console.log('Uploaded files:', uploadedFiles);
      
      let totalImported = 0;
      let totalUpdated = 0;
      let totalErrors = 0;

      // Process each XML file from the ZIP
      for (const xmlContent of xmlFiles) {
        const { imported, updated, errors } = await processXmlContent(xmlContent);
        totalImported += imported;
        totalUpdated += updated;
        totalErrors += errors;
      }

      const successMessage = [
        totalImported > 0 ? `${totalImported} properties imported` : '',
        totalUpdated > 0 ? `${totalUpdated} properties updated` : '',
        totalErrors > 0 ? `${totalErrors} errors` : ''
      ].filter(Boolean).join(', ');

      if (totalImported > 0 || totalUpdated > 0) {
        toast({
          title: "Success",
          description: successMessage,
        });
      } else {
        toast({
          title: "Warning",
          description: totalErrors > 0 
            ? `No properties were processed successfully. ${successMessage}`
            : "No properties were found to import.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import properties. Make sure the ZIP file URL is accessible.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="xmlImportUrl">ZIP File URL</Label>
      <Input
        id="xmlImportUrl"
        name="xmlImportUrl"
        value={settings.xmlImportUrl || ""}
        onChange={onChange}
        placeholder="https://example.com/properties.zip"
        disabled={isProcessing}
      />
      <Button 
        onClick={importProperties} 
        type="button" 
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? "Importing..." : "Import from URL"}
      </Button>
    </div>
  );
}
