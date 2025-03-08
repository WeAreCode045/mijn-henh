
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function ImageUploader({ onImageUpload, isUploading }: ImageUploaderProps) {
  const fileInputRef = createRef<HTMLInputElement>();
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validate files
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    // Check file types
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setValidationMessage('Only image files are allowed');
        toast.error('Only image files are allowed');
        // Reset the file input value
        e.target.value = '';
        return;
      }
    }

    // Clear any previous validation message
    setValidationMessage(null);
    
    // Call the parent handler
    onImageUpload(e);
    
    // Reset the file input value
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isUploading}
        onClick={handleUploadClick}
      >
        <UploadIcon className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Images"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {validationMessage && (
        <p className="text-sm text-red-500">{validationMessage}</p>
      )}
    </div>
  );
}
