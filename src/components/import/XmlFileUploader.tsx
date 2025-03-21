
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface XmlFileUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export function XmlFileUploader({ onFileUpload, isUploading }: XmlFileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="xml-file">XML File</Label>
        <Input 
          id="xml-file" 
          type="file" 
          accept=".xml"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      
      {selectedFile && (
        <div className="space-y-2">
          <p className="text-sm">Selected file: {selectedFile.name}</p>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload and Parse XML"}
          </Button>
        </div>
      )}
      
      {!selectedFile && (
        <p className="text-sm text-gray-500">
          Please select an XML file containing property data to import.
        </p>
      )}
    </div>
  );
}
