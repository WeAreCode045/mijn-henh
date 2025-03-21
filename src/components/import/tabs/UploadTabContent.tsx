
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XmlFileUploader } from "@/components/import/XmlFileUploader";
import { XmlData } from "@/hooks/import/useXmlFileUpload";

interface UploadTabContentProps {
  xmlData: XmlData[] | null;
  isUploading: boolean;
  onFileUpload: (file: File) => void;
  onContinueToMapping: () => void;
}

export function UploadTabContent({
  xmlData,
  isUploading,
  onFileUpload,
  onContinueToMapping
}: UploadTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload XML File</CardTitle>
        <CardDescription>
          Upload an XML file containing property data to import into the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <XmlFileUploader onFileUpload={onFileUpload} isUploading={isUploading} />
        
        {xmlData && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Found {xmlData.length} properties in the file.
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
