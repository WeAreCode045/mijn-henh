
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createRef } from "react";

interface ImageUploaderProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function ImageUploader({ onImageUpload, isUploading }: ImageUploaderProps) {
  const fileInputRef = createRef<HTMLInputElement>();

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload(e);
    // Reset the file input value
    e.target.value = '';
  };

  return (
    <div>
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
    </div>
  );
}
