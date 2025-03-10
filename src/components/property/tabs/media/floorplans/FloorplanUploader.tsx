
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createRef } from "react";

interface FloorplanUploaderProps {
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  // Add backward compatibility with isLoading prop
  isLoading?: boolean;
  // Add support for onUpload as an alias for onFloorplanUpload
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FloorplanUploader({ 
  onFloorplanUpload, 
  isUploading, 
  isLoading, 
  onUpload 
}: FloorplanUploaderProps) {
  const fileInputRef = createRef<HTMLInputElement>();
  
  // Use isLoading as fallback if isUploading is not provided
  const uploading = isUploading || isLoading || false;
  
  // Use onUpload as fallback if onFloorplanUpload is not provided
  const handleUpload = onFloorplanUpload || onUpload || (() => {});

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e);
    // Reset the file input value
    e.target.value = '';
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={uploading}
        onClick={handleUploadClick}
      >
        <UploadIcon className="w-4 h-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Floorplans"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}
