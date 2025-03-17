
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { ChangeEvent, useRef } from "react";

interface PropertyAreaImageUploadProps {
  areaId: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading?: boolean;
}

export function PropertyAreaImageUpload({
  areaId,
  onUpload,
  isUploading = false
}: PropertyAreaImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Store the areaId in the event data-* attribute for the handler
    if (e.currentTarget) {
      e.currentTarget.setAttribute('data-area-id', areaId);
      onUpload(e);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
      <Button
        variant="outline"
        onClick={handleUploadClick}
        disabled={isUploading}
        className="w-full"
        type="button"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Select Images From Library
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Use the Media tab to upload new images. Here you can select from existing images.
      </p>
    </div>
  );
}
