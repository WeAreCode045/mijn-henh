
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  label?: string;
}

export function ImageUploader({ onUpload, isUploading, label = "Upload Image" }: ImageUploaderProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <label className="relative cursor-pointer">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          disabled={isUploading}
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
          multiple
        />
      </label>
    </div>
  );
}
