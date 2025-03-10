
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

    console.log("Selected files for upload:", files.length);

    // Check file types and sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setValidationMessage('Only image files are allowed');
        toast.error('Only image files are allowed');
        // Reset the file input value
        e.target.value = '';
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setValidationMessage('Images must be less than 10MB');
        toast.error('Images must be less than 10MB');
        // Reset the file input value
        e.target.value = '';
        return;
      }
    }

    // Clear any previous validation message
    setValidationMessage(null);
    
    // Show uploading toast
    toast.info(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);
    
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
      {isUploading && (
        <p className="text-sm text-blue-500">Uploading images, please wait...</p>
      )}
    </div>
  );
}
