
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  label?: string;
  multiple?: boolean;
}

export function ImageUploader({ 
  onUpload, 
  isUploading, 
  label = "Upload Image",
  multiple = false
}: ImageUploaderProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <label className="relative cursor-pointer">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          disabled={isUploading}
          onClick={(e) => e.preventDefault()} // Prevent form submission
        >
          <UploadIcon className="h-4 w-4" />
          {isUploading ? "Uploading..." : label}
        </Button>
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={isUploading}
          className="hidden"
          multiple={multiple}
        />
      </label>
    </div>
  );
}
