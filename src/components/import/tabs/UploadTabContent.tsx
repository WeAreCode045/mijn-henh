
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XmlFileUploader } from "@/components/import/XmlFileUploader";
import { ZipFileUploader } from "@/components/import/ZipFileUploader";
import { XmlData } from "@/hooks/import/useXmlFileUpload";

interface UploadTabContentProps {
  xmlData: XmlData[] | null;
  isUploading: boolean;
  onFileUpload: (file: File) => void;
  onFilesProcessed: (data: any[]) => void;
  onContinueToMapping: () => void;
}

export function UploadTabContent({
  xmlData,
  isUploading,
  onFileUpload,
  onFilesProcessed,
  onContinueToMapping
}: UploadTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Property Data</CardTitle>
        <CardDescription>
          Upload an XML file or a ZIP file containing multiple XML files with property data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="xml" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="xml">Single XML File</TabsTrigger>
            <TabsTrigger value="zip">ZIP File (Bulk Import)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="xml">
            <XmlFileUploader onFileUpload={onFileUpload} isUploading={isUploading} />
          </TabsContent>
          
          <TabsContent value="zip">
            <ZipFileUploader onFilesProcessed={onFilesProcessed} />
          </TabsContent>
        </Tabs>
        
        {xmlData && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Found {xmlData.length} properties in the file(s).
            </p>
            <Button onClick={onContinueToMapping}>
              Continue to Field Mapping
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
