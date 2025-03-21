
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { processZipFile } from "./ZipProcessor";
import { processXmlContent } from "./XmlProcessor";

interface FileUploaderProps {
  title: string;
}

export function FileUploader({ title }: FileUploaderProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a ZIP file",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.endsWith('.zip')) {
      toast({
        title: "Error",
        description: "Only ZIP files are supported",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const buffer = await file.arrayBuffer();
      const { xmlFiles, uploadedFiles } = await processZipFile(buffer, file.name);
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
        description: error instanceof Error ? error.message : "Failed to import properties",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="zipFileUpload">{title}</Label>
      <Input
        id="zipFileUpload"
        type="file"
        accept=".zip"
        onChange={handleFileUpload}
        className="cursor-pointer"
        disabled={isProcessing}
      />
      {isProcessing && <p className="text-sm text-muted-foreground">Processing file...</p>}
    </div>
  );
}
